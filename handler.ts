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
        title: 'Name',
        description: 'The name of the person to greet.',
        type: 'string',
        required: true,
      },
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
      a: {
        title: 'A',
        description: 'The first number.',
        type: 'number',
        required: true,
      },
      b: {
        title: 'B',
        description: 'The second number.',
        type: 'number',
        required: true,
      },
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
      one: {
        title: 'One',
        description: 'The first parameter.',
        type: 'string',
        required: true,
      },
      two: {
        title: 'Two',
        description: 'The second parameter.',
        type: 'string',
        required: true,
      },
      three: {
        title: 'Three',
        description: 'The third parameter.',
        type: 'string',
        required: true,
      },
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
  
  definitions.push({
    id: 'error',
    meta: {
      label: 'Error Thrower',
      description: 'Returns an error code of your choosing. Used to test how AP and CE handle errors',
    },
    version: '1.0.0',
    parameters: {
      errorCode: {
        title: 'Error code',
        description: "The error code, e.g., 404, 500. I don't know what will happen if you make this 200.",
        type: 'number',
        required: true,
      },
      message: {
        title: 'Message',
        description: 'The message that will be returned with your error.',
        type: 'string',
        required: true,
      },
    },
    results: {
      meaning: {
        title: "The answer to all of life's biggest mysteries",
        description: 'This result will technically never be seen since this node always throws an error.',
        type: 'object',
        properties: {
          meaning: { type: 'string' }
        },
      },
    },
  })

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

    case 'error':
      const error = {
        statusCode: 200,
        body: JSON.stringify({
          isSuccess: false,
          error: {
            status: nodeInput.parameters.errorCode,
            message: nodeInput.parameters.message
          }
        })
      }
      cb(null, error)
      break;
      
    default:
      cb(null, {
        statusCode: 404,
        body: `"${integrationNodeId}" is an unknown integration node id.`
      });
  }
}
