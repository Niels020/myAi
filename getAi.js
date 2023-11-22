export async function getResponse(query, aiPersonality) {
    const options = {
        method: "POST",
        body: JSON.stringify({
            messages: [
                {role: "system", content: aiPersonality},
                {role: "user", content: query}
            ]
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }

    try {
        const res = await fetch("http://localhost:8000/completions", options)
        const data = await res.json()

        console.log(data)
        return data.choices[0].message.content
    } catch (error) {
        console.error(error)
    }   
}
