import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

// Definitions handler function.
// Returns an array of objects matching the e-bot7 Application JSON schema.
// The contents of each object determine what inputs each integration node expects
// and what properties the results have.
export const integrationNodesDefinition: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  const definitions = [];
  
  // This integration node receives a parameter called name.
  // The node returns an object with a greeting property.
  definitions.push({
    id: 'helloWorld',
    meta: {
      label: 'Hello World',
      description: 'Display a greeting.',
    },
    version: '1.0.0',
    parameters: {
      type: 'object',
      properties: {
        name: {
          title: 'Name',
          description: 'The name of the person to greet.',
          type: 'string',
        },
      },
      required: ['name'],
    },
    results: {
      greeting: {
        title: 'Greeting',
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
      type: 'object',
      properties: {
        a: {
          title: 'A',
          description: 'The first number.',
          type: 'number',
        },
        b: {
          title: 'B',
          description: 'The second number.',
          type: 'number',
        },
      },
      required: ['a', 'b']
    },
    results: {
      sum: {
        title: 'Sum',
        description: 'The sum of the two inputs',
        type: 'object',
        properties: {
          sum: { type: 'number' }
        },
      },
    },
  });

  definitions.push({
    id: 'concat',
    meta: {
      label: 'Concat',
      description: 'Returns one string consisting of all inputs concatenated.',
    },
    version: '1.0.0',
    parameters: {
      type: 'object',
      properties: {
        one: {
          title: 'One',
          description: 'The first parameter.',
          type: 'string',
        },
        two: {
          title: 'Two',
          description: 'The second parameter.',
          type: 'string',
        },
        three: {
          title: 'Three',
          description: 'The third parameter.',
          type: 'string',
        },
      },
      required: ['one', 'two', 'three']
    },
    results: {
      concat: {
        title: 'Success',
        description: 'The concatenation of all inputs',
        type: 'object',
        properties: {
          concatenation: { type: 'string' }
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
// Execution handler function.
// Receives an input as defined in the definitions handler.
// Returns a result as defined in the definitions handler.
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

    case 'concat':
      cb(null, {
        statusCode: 200,
        body: JSON.stringify({
          isSuccess: true,
          result: {
            resultType: 'concat',
            data: {
              concatenation: Object.values(nodeInput.parameters).join('-')
            }
          },
        })
      });
      break;

    default:
      cb(null, {
        statusCode: 404,
        body: `"${integrationNodeId}" is an unknown integration node id.`
      });
  }
}
