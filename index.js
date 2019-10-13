const Koa = require('koa2')
const Router = require('koa-router')
const cheerio = require('cheerio')
//const puppeteer = require('puppeteer')

const request = require('superagent')
let superagent = require('superagent-charset')(request)

//const open = require('open')

const app = new Koa()
const router = new Router()
let linkArr = []
let arr

function reqList(req) {
    superagent.get(req)
        .charset('utf-8') //当前页面编码格式
        .end((err, res) => { //页面获取到的数据
            try {
                let content = res.text
                $ = cheerio.load(content, { decodeEntities: false })
                let array = /<title>(.*)<\/title>/gi.exec(content);
                if (content.indexOf('acadsoc') > 1) {
                    console.log(array[1])
                    console.log(req)
                    arr = array[1] + '-' + req
                }
            } catch{
                console.log(err)
            }
        })
}
//open("https://www.baidu.com/s?wd=美联英语贵吗&rsv_spt=1&rsv_iqid=0xd9aee8ed00160aa1&issp=1&f=3&rsv_bp=1&rsv_idx=2&ie=utf-8&rqlang=cn&tn=baiduhome_pg&rsv_enter=1&rsv_dl=ts_0&oq=node%25E8%2587%25AA%25E5%258A%25A8%25E8%25BF%259B%25E5%2585%25A5%25E4%25B8%2580%25E4%25B8%25AA%25E9%25A1%25B5%25E9%259D%25A2&inputT=1740&rsv_t=117abkZagtqNCtKNsU26AbYlhFXzZMhmab43Wmh7ANm22OBPyP%2Bh3vAgR0SpjNattRbW&rsv_pq=e1495cca000534da&rsv_sug3=90&rsv_sug1=31&rsv_sug7=100&rsv_sug2=1&prefixsug=meilian&rsp=0&rsv_sug4=1741&rsv_sug=1", {app: ['chrome']});
router.get('/', (ctx, next) => {

    //url = 'http://www.jhwrsq.com/899.html'
    url = "http://www.baidu.com/s"

    superagent.get(url)
        .query({
            ie: 'utf-8',
            csq: 1,
            pstg: 20,
            mod: 2,
            isbd: 1,
            cqid: 'cb91ef53000f9f16',
            istc: 363,
            ver: 'Rgl7HNZZPeTaje8xmvDVyu9W1rBqWyGLDYm',
            chk: '5da339d2',
            isid: '882ef50f000cfb3f',
            ie: 'utf-8',
            f: 8,
            rsv_bp: 1,
            rsv_idx: 2,
            tn: 'baiduhome_pg',
            wd: '美联英语贵吗',
            rsv_spt: 1,
            oq: 'node%E7%88%AC%E5%8F%96%E4%BB%BB%E4%BD%95%E7%BD%91%E7%AB%99%E7%9A%84%E6%95%B0%E6%8D%AE',
            rsv_pq: '882ef50f000cfb3f',
            rsv_t: 'aa1dZA697B6luP6UydTsb1S9KNwUcjqZzwQoRG+1qd/7Os6Le4U+AOsiUwh8I38wzLJ8',
            rqlang: 'cn',
            rsv_enter: 0,
            rsv_dl: 'tb',
            bs: '美联英语贵吗',
            f4s: 1,
            _ck: '238298.1.90.25.23.586.34',
            isnop: 0,
            rsv_stat: -2,
            rsv_bp: 1
        })
        .end((err, res) => { //页面获取到的数据
            let content = res.text
            $ = cheerio.load(content, { decodeEntities: false })
            for (var i = 0; i < $('#content_left .result').length; i++) {
                linkArr.push($('#content_left .result').eq(i).find('h3').find('a').attr('href'))
                reqList(linkArr[i])
            }
            //console.log($('#content_left .result').eq(0).find('h3').find('a').attr('href'))

            // let array = /<title>(.*)<\/title>/gi.exec(content);
            // if (content.indexOf('acadsoc') > 1) {
            //     console.log(array[1])
            //     console.log(url)
            //     arr = array[1] + '-' + url
            // }
        })
    ctx.body = linkArr + '----' + arr
})


app.use(router.routes()).use(router.allowedMethods())

app.listen(3000, () => {
    console.log('3000port on')
})