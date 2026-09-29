import { BACKEND_URL } from "@/config/app";
export async function sendUserInputToLLM(userInput: string) {
    try{
        // console.log("Sending user input to LLM:- ", userInput);
        const res = await fetch(`${BACKEND_URL}/api/llm/agent`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ input: userInput })
        });
        if(res.ok){
            const data = await res.json();
            // console.log("LLM Response:- ", data.response);
            return data;
        }
    }catch(err){
        console.error("Error sending user input to LLM:", (err as Error).message);
    }
}