import jwt from "jsonwebtoken";
import fs from "fs";


//let  envKey = 'test'
//let  publicKey = fs.readFileSync(__dirname+'/'+envKey+'/public.pem');
//let  privateKey = fs.readFileSync(__dirname+'/'+envKey+'/private.pem');


let privateKey="MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCzfECkwTPGyWCUNfbp3WRfGDcmByqdfAoBBHmr3F6u39mGX+WDS0XA077fY9ZDQFC/umRlEMIbMXOLThy2avrFsjn/7agw3YwX8qZ/ZDeWqPAZU5LNg5OlcZ+eH6kcm+kG5PTu43Ud6X69Brg7X94tzS9bZQR0/21U1lfO3XG/Cb6hzbOlvrtUwbovipBBDjjFHnLf/OvBBhE1sxxpPQWWSOXtbMYnxhUrVegUYkfb+vmD9XYs5knGrWXTlLYNIEFqw0dehUYAR/L0t5VVM5x0dugT8vb6nNOsWq1pVub2p7jTmZr8Tip2mrUNySVtcTdxvKxEyOCVEFsSKBNKvABLAgMBAAECggEBAKNRorjIHMb7ouf6Gs0+6QAm1rfBuaNHpQq7+cLKaVWS1yqQxBUuPzBw/LPk8qiLM27iukvEbfu0icDuuO28dqfBv0kEBhFA5yM7ZwlwNazf2GoTQ/fBjG308BtAD++6ZtYhLEbbrkwjlXGHVcihOVhP5pGxX9bePav+xjO0CLadK42eApDIJFFASAXnNR5A8YAe+bjqXrAcvEFqV86HWwvdvHJxAziPtKZm0RhHgF1ofbqkmimIi8Cvf5IiVTwD1w0SFR9Qu6ZvraaAifV3SJCxeoB0FTjVpxBCxqvKChHRv7ZwVpIZdPFg94lGJgjn3YORrfCNT6MWHauG3108k4ECgYEA9f5OM5clXAmWmQj4VMFxIIcyzyikL4sQHaCiqBYCeLkgNEVmQrLb+4B67fMYrL3MCk3Qfr1512Mw3DWgP3e1N6cd4o6ZIIUW5TJ+XetfgxRFkSXZX2nl6Ji4l17fUBO+jfm5OZmJDpB/JLAKrGeIlsHGkWIOD0J9KU4/YlC/HGECgYEAuslas3tk5ng3ERYFcr3BuO1pBp2L0mTo7ObmkW1KOJKhtUmPKkDHL4JMfaiJHJPuwFq8Od7wuKYUlt3ID4cnE+Q3IqUN/LPiy27uyPVQrXZM/S8ZjyFUEkvr9kwPE4ItKw5ruNro3S07Z4Xf/osf/IxZ7uIHaPHFrwYPOo2rvCsCgYA56qPy1ZVANCm24jvFiL3f0LUPvRva7bzfnOBu/q+aSMviQqyu63mLn1ZSC7g1g4I0stlx3Z6ALaRlVGLkToTmE3yfyL8Yvv0C/X5vEmmsbOtsHyMsqbwtpTdgvD+LlPp6Zt9LRnDUcwTcWG5K5R1tkTX1KMbypM7fGMMnnKdCQQKBgALrIn+rbegr+LBLp8ojLOO20e1IiObArOMGuJONIZvArsYmYBZI7NPRNWDBQWMw7IoU4NwGn7xC3A9/Z6DWe8XTywi/i3hnVyPWl+SL8LbFIm7STZPu8WFXzlgK2DF11z7U+tnokbri+gqkDNvtUJKhnsYcwgDhxjT140cG76gBAoGAVvyq059+vLlobbaxAQ/kA0kQ46GcUnIwbMOjqd3HM8GpjV+uCvZyE7HiMbSjJovht/mHevetOppu+atpQV4XhEN3m4wvx7tOYyBsv9oThHQMsCKf2KJpFI/Cp7dHuJrrE/lqvDHFRdZJTdBoBU/p3tN25iSC2Cmp3jz6gmgWYTA="

    let publicKey="MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAs3xApMEzxslglDX26d1kXxg3JgcqnXwKAQR5q9xert/Zhl/lg0tFwNO+32PWQ0BQv7pkZRDCGzFzi04ctmr6xbI5/+2oMN2MF/Kmf2Q3lqjwGVOSzYOTpXGfnh+pHJvpBuT07uN1Hel+vQa4O1/eLc0vW2UEdP9tVNZXzt1xvwm+oc2zpb67VMG6L4qQQQ44xR5y3/zrwQYRNbMcaT0Flkjl7WzGJ8YVK1XoFGJH2/r5g/V2LOZJxq1l05S2DSBBasNHXoVGAEfy9LeVVTOcdHboE/L2+pzTrFqtaVbm9qe405ma/E4qdpq1DcklbXE3cbysRMjglRBbEigTSrwASwIDAQAB"


export default class extends G.controller.rest {

    init(){
        super.init()
/*        this.jwt = {}
        this.jwt.token = this.req.headers&&this.req.headers.token||false
        let user = {a:234234234234234}

        //console.log(privateKey)
        console.log(publicKey)
        //console.log(this.jwt.token)
        let token = jwt.sign(user, privateKey,{ algorithm: 'RS256' })
        console.log(token)
        let tokenToUser = jwt.verify(token, publicKey)
        console.log(tokenToUser)*/


    }


}