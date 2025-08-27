from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel 
from dotenv import load_dotenv
import os
from openai import AzureOpenAI
app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

class UserResponse(BaseModel):
    user_input: str

load_dotenv()

# Retrieve environment variables
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_MODEL_NAME = os.getenv("AZURE_OPENAI_MODEL_NAME")
AZURE_OPENAI_CHAT_DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_CHAT_DEPLOYMENT_NAME")
AZURE_OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION")



client = AzureOpenAI(
    api_key=AZURE_OPENAI_API_KEY,
    api_version=AZURE_OPENAI_API_VERSION,
    base_url=f"{AZURE_OPENAI_ENDPOINT}/openai/deployments/{AZURE_OPENAI_CHAT_DEPLOYMENT_NAME}"   
)

messages = [{"role": "system", "content": "You are a helpful assistant."}]

@app.post("/chatAzureOpenAI")
async def chat_azure_openai(payload : UserResponse):
    user_input = payload.user_input
    if user_input.lower() == "exit":
        return {"message": "Ending the conversation. Have a great day!"}
    messages.append({"role": "user", "content": user_input})
    response = client.chat.completions.create(
        model=AZURE_OPENAI_CHAT_DEPLOYMENT_NAME, # type: ignore
        max_tokens=1000,
        messages=messages
    )
    ai_message = response.choices[0].message.content
    
    # guardamos la respuesta del asistente en el historial
    messages.append({"role": "assistant", "content": ai_message})
    return {"response": ai_message}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
    )
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=9000)
    
