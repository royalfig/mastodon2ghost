// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  try {
    const {
      post: {
        current: { excerpt, title, url },
      },
    } = JSON.parse(event.body);

    const response = await fetch('https://mastodon.social/api/v1/statuses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MASTODON}`,
      },
      body: JSON.stringify({ status: `${excerpt}\n\n${url}` }),
    });
    
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      throw new Error(response.statusText);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `${title} posted to Mastodon!` }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
