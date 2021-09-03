/* The code below outputs the message ID and the messages received
from the API on the console and the browser. The output is printed 
to the browser at http://127.0.0.1:8080 

*** Refresh the browser once to see the output on the console ***

*/

const http = require('http')
const request = require('request')

/* The piece of code is required to avoid manually setting the PORT env variable
in the shell before execution. This helps automatically configuring the portnumber 
to use for rendering the response from nodejs */
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const hostname = '127.0.0.1' // Hostname for the website
const port = process.env.PORT // Portname configured via the exec call 

// USERNAME and PASSWORD set here
let username = 'apiuser';
let password = ''; // PASSWORD hidden 
let options = {
  url: '', // URL hidden
  auth: {
    user: username,
    password: password
  },
};

/*Create a server which listens to requests at the host address. The callback
also makes request to the API to retrieve the list of email messages and renders it
onto the browser at the host address */
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');

  // Make a request to the API with options defined earlier
  request(options, function (err, response, body) {
    if (err) {
      console.dir( err );
    }

    // Temporary function to parse JSON and get the sorted items and count
    let getParsedBody = ( body ) => {
        body = JSON.parse(body); // Parse the JSON received

        let items = body.items;
        const count = body.count;

        // Sort the items in ascending order
        items = items.sort( (item1, item2) => {
            return item1.emailMessageId - item2.emailMessageId;
        });

        return [items, count];
    }

    // Create a temporary function to parse the items and format the output string
    let getOutputString = ( items, count ) => {
        let outputString = '';

        for( let item of items ) {
            outputString += `${item.emailMessageId} ${item.name}\n`;
        }

        outputString += `\nTotal: ${count} emails \n`;

        return outputString;
    }

    [items, count] = getParsedBody(body);
    outputString = getOutputString(items, count);

    // Show the output string on the browser and the console
    console.clear();
    console.log( outputString );
    res.end( outputString );

  });  
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
