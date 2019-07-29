interface ResponseType {
  statusCode: number;
  body: string;
}

export async function server (event: any, context: any) {
  const response: ResponseType = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello, world!'
    })
  }

  return response;
}