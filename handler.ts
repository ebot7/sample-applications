import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

export const integrationNodesDefinition: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
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
        required: true,
      },
    },
    results: {
      greeting: {
        label: 'Greeting',
        description: 'A greeting.',
        type: 'object',
        properties: {
          greeting: {
            type: 'string',
          },
        }
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
        type: 'object',
        properties: {
          sum: { type: 'number' }
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

export const integrationNodesExecution: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const nodeInput = JSON.parse(event.body);
  const integrationNodeId = event.pathParameters.id;

  switch (integrationNodeId) {
    case 'helloWorld':
      cb(null, {
        statusCode: 200,
        body: JSON.stringify({
          isSuccess: true,
          result: {
            resultType: 'greeting',
            data: {
              greeting: `Hello ${nodeInput.parameters.name}`
            }
          },
        })
      });
      break;

    case 'sum':
      cb(null, {
        statusCode: 200,
        body: JSON.stringify({
          isSuccess: true,
          result: {
            resultType: 'sum',
            data: {
              sum: nodeInput.parameters.a + nodeInput.parameters.b
            }
          },
        })
      });
      break;
  }

  cb(null, {
    statusCode: 404,
    body: `"${integrationNodeId}" is an unknown integration node id.`
  })
}
