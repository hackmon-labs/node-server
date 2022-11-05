import Arena from "@colyseus/arena";
import { monitor } from "@colyseus/monitor";
import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport";
import { WebSocketTransport } from  "@colyseus/ws-transport";
import { Hackmon } from './rooms/Hackmon'
import basicAuth from "express-basic-auth";
import cors from 'cors'

const port = Number(process.env.PORT);

export default Arena({
  getId: () => "Hackmon",

  initializeGameServer: (gameServer) => {

    gameServer.define('Hackmon', Hackmon);
    // console.log(gameServer, 'g', Hackmon)

  },

  initializeTransport: (options) => {

    // return new uWebSocketsTransport({});

    /**
     * 定义服务器传输层协议为原始 WS (旧版)
     */
    return new WebSocketTransport({
        ...options,
        pingInterval: 5000,
        pingMaxRetries: 3,
    });
  },

  initializeExpress: (app) => {

    app.get("/", (req, res) => {
      res.send("ok!");
    });


    const basicAuthMiddleware = basicAuth({
      // 用戶名/密碼列表
      users: {
        "admin": "qop",
      },
      // 發送 WWW-Authenticate 響應頭部, 提示用戶
      // 填寫用戶名和密碼
      challenge: true
    });
    app.use(cors());

    app.use("/colyseus", basicAuthMiddleware, monitor());


    app.get("/test", (req, res) => {
      res.send("if you can see it,this is working");
    });

  },


  beforeListen: () => {
    // console.log(`Listening on ws://localhost:${port}  hh`)
  }
});