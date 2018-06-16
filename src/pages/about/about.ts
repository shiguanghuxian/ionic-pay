import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { Http, Headers, Request } from '@angular/http';
import { WechatChenyu } from "wechat-chenyu";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  // 微信支付订单信息
  weiPayinfo = null;
  // 页面文本框
  url: string // 获取订单信息url
  header: string // 请求需要的头信息
  body: string // 请求体
  method: string = '0' // 请求方式
  notifyUrl: string // 回调服务器地址

  constructor(public navCtrl: NavController,
    private http: Http,
    public alertCtrl: AlertController,
    private wechatChenyu: WechatChenyu) {

  }

  // 获取微信支付订单
  getWechatPayOrder() {
    console.log(this.url);
    if (this.url == '' || typeof this.url == 'undefined') {
      this.alertCtrl.create({
        title: '提示',
        subTitle: "订单获取url不能为空",
        buttons: ['OK']
      }).present();
      return
    }
    console.log(this.header)
    if (this.header == '' || typeof this.header == 'undefined') {
      this.header = '{}';
    }
    let method = Number(this.method)
    // console.log(typeof method)

    let headerObj = JSON.parse(this.header);

    this.http.request(new Request({
      method: method,
      url: this.url,
      headers: new Headers(headerObj),
      body: this.body
    })).
      toPromise().
      then(res => {
        // 提示请求结果
        const prompt = this.alertCtrl.create({
          title: '成功',
          message: res.text(),
          inputs: [
            {
              name: 'code',
              value: res.text(),
            },
          ],
          buttons: ['OK']
        });
        prompt.present();
        // 组织调用插件参数
        let resObj = res.json();
        this.weiPayinfo = {
          partnerid: resObj.partnerid, // merchant id
          prepayid: resObj.prepayid, // prepay id
          noncestr: resObj.noncestr, // nonce
          timestamp: resObj.timestamp + "", // timestamp
          sign: resObj.sign // signed string
        };

      }).
      catch(error => {
        const prompt = this.alertCtrl.create({
          title: '错误',
          message: error
        });
        prompt.present();
      });
  }

  // 微信支付
  onWechatPay() {
    if (this.weiPayinfo == null) {
      const alert = this.alertCtrl.create({
        title: '提示',
        subTitle: "请先获取微信支付订单",
        buttons: ['OK']
      });
      alert.present();
      return
    }

    this.wechatChenyu.sendPaymentRequest(this.weiPayinfo).then(data => {
      const prompt = this.alertCtrl.create({
        title: '成功',
        // message: JSON.stringify(data),
        inputs: [
          {
            name: 'data',
            value: JSON.stringify(data)
          },
        ],
      });
      prompt.present();
      // 调用服务端
      this.NotifyServerUrl(data);
    }, error => {
      const prompt = this.alertCtrl.create({
        title: '错误',
        message: error
      });
      prompt.present();
    }
    );

  }

  // 支付成功后调用服务端
  NotifyServerUrl(data) {
    if (this.notifyUrl == '' || typeof this.notifyUrl == 'undefined') {
      const alert = this.alertCtrl.create({
        title: '成功',
        message: "服务端回调地址为空，不进行回调",
        buttons: ['OK']
      });
      alert.present();
      return
    }

    this.http.post(this.notifyUrl, data).
      toPromise().
      then(res => {
        const alert = this.alertCtrl.create({
          title: '成功',
          message: res.text(),
          buttons: ['OK']
        });
        alert.present();
      }).
      catch(error => {
        const alert = this.alertCtrl.create({
          title: '错误',
          message: error,
          buttons: ['OK']
        });
        alert.present();
      })
  }

}
