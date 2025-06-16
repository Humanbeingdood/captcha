export async function POST(req) {

    const body = await req.json();
    const token = body.token;

    const secretKey = '6Lc1hFsrAAAAANo6jgCPhN8YEVV7sX6DTLtVd93C';

    const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `secret=${ secretKey }&response=${ token }`
    })

    const verification = await verifyRes.json();
    return new Response(JSON.stringify(verification), {
        status:200,
        headers: {'Content-Type': 'application/json'},
    });
}