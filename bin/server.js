#!/usr/bin/env node

/**
 * @type {any}
 */
const WebSocket = require('ws')
const http = require('http')
const wss = new WebSocket.Server({ noServer: true })
const setupWSConnection = require('./utils.js').setupWSConnection

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 1234
const API_HOST = process.env.API_HOST || 'http://127.0.0.1:8888';

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('okay')
})

wss.on('connection', setupWSConnection)

server.on('upgrade', (request, socket, head) => {
  // You may check auth of request here..
  /**
   * @param {any} ws
   */
  const handleAuth = ws => {
      const queryString = request.url.split('?')[1];
      const token = queryString.split('&').find(p => p.startsWith('token=')).split('=')[1];
      const docName = request.url.slice(1).split('?')[0];

      console.log(new Date(), "CONN", docName);

      http.get(API_HOST + '/internal/validate_connection_token/program/by-id/' + docName,
               {
                   headers: { authorization: token }
               },
               (res) => {
                   const { statusCode } = res;
                   const contentType = res.headers['content-type'];

                   if (Math.trunc(statusCode / 100) !== 2) {
                       console.error(new Date(), 'Request Failed. ' +
                                     `Status Code: ${statusCode}`);
                       ws.close();
                       return;
                   }

                   wss.emit('connection', ws, request)
               }).on('error', (e) => {
                   console.error(new Date(), `Got error: ${e.message}`);
                   ws.close();
               });
  }
  wss.handleUpgrade(request, socket, head, handleAuth)
})

server.listen({ host, port })

console.log(`running at '${host}' on port ${port}`)
