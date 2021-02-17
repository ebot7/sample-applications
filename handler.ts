import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

export const integrationNodes: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const definitions = [];
  
  definitions.push({
    id: 'helloWorld',
    meta: {
      label: 'Hello World',
      description: 'Display a greeting.',
    },
    version: '1.0.0',
    parameters: {
      name: {
        label: 'Name',
        description: 'The name of the person to greet.',
        type: 'string',
        required: false,
      },
    },
    results: {
      greeting: {
        label: 'Greeting',
        description: 'A greeting.',
        schema: {
          type: 'string',
        },
      },
    },
  });

  definitions.push({
    id: 'sum',
    meta: {
      label: 'Sum',
      description: 'Returns the sum of two numbers.',
    },
    version: '1.0.0',
    parameters: {
      a: {
        label: 'A',
        description: 'The first number.',
        type: 'number',
        required: true,
      },
      b: {
        label: 'B',
        description: 'The second number.',
        type: 'number',
        required: true,
      },
    },
    results: {
      sum: {
        label: 'Sum',
        description: 'The sum of the two inputs',
        schema: {
          type: 'number',
        },
      },
    },
  });

  const response = {
    statusCode: 200,
    body: JSON.stringify(definitions),
  };

  cb(null, response);
}
