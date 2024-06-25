import express from 'express'   // 웹서버 생성을 위해 express 관련 파일을 가져옴
import path from 'path'            // nodejs에 내장된 라이브러리. 설치없이 바로 사용함
import cors from 'cors'            // 교차출처 허용을 위한 라이브러리
import authRouter from './routers/authRouter.js'
import boardRouter from './routers/boardRouter.js'
import productRouter from './routers/productRouter.js'
import otherRouter from './routers/otherRouter.js'

const app = express()
const PORT = 80

// const corsOptions = {
//     origin: 'http://localhost:5173', 
//     credentials:true
// } 
// app.use(cors(corsOptions)) 
app.use(cors()) 

app.use(express.json())           // 사용자의 json 요청을 처리하여 req.body 객체에 저장해줌


// 리소스 파일들을 관리하는 경로 지정하세요.
const __dirname = path.resolve()
app.use(express.static(path.join(__dirname, 'build')))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/build/index.html"));
});

app.use('/auth', authRouter)
app.use('/board', boardRouter)
app.use('/product', productRouter)
app.use('/other', otherRouter)


// 지정한 포트에서 서버를 실행함
app.listen(PORT, ()=>console.log(`Listening on port ${PORT}`))
