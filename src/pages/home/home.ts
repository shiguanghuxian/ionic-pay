import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Http, Headers, Request } from '@angular/http';


declare let cordova;
// declare var Wechat: any;  // 此处声明plugin.xml中clobbers对应的值

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  // 支付宝支付订单
  aliPayinfo = '';
  // 页面文本框
  url: string // 获取订单信息url
  header: string // 请求需要的头信息
  body: string // 请求体
  method: string = '0' // 请求方式
  notifyUrl: string // 回调服务器地址

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    private http: Http) {

  }

  // 获取支付订单
  getAliPayOrder() {
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

    // 请求类型转换未number
    let method = Number(this.method)
    // console.log(typeof method)

    let headerObj = JSON.parse(this.header);

    this.http.request(new Request({
      method: method,
      url: this.url,
      headers: new Headers(headerObj),
      body: this.body
    })).toPromise().
      then(res => {
        // 获取订单信息成功提示
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
        // 赋值给请求参数对象
        this.aliPayinfo = res.text();
      }).
      catch(error => {
        const prompt = this.alertCtrl.create({
          title: '错误',
          message: error
        });
        prompt.present();
      });
  }

  // 支付支付
  onAlipay() {
    if (this.aliPayinfo == '') {
      const alert = this.alertCtrl.create({
        title: '提示',
        subTitle: "请先获取支付宝支付订单",
        buttons: ['OK']
      });
      alert.present();
      return
    }
    // 调起支付宝app支付
    let that = this;
    cordova.plugins.alipay.payment(this.aliPayinfo, function success(e) {
      const alert = that.alertCtrl.create({
        title: '成功',
        // subTitle: result.alipay_trade_app_pay_response.msg,
        inputs: [
          {
            name: 'info',
            value: JSON.stringify(e)
          },
        ],
        buttons: ['OK']
      });
      alert.present();
      // 调用服务端
      that.NotifyServerUrl(e);

    }, function error(e) {
      const alert = that.alertCtrl.create({
        title: '失败',
        subTitle: JSON.stringify(e),
        buttons: ['OK']
      });
      alert.present();
    });

  }

  // 支付成功后调用服务端
  NotifyServerUrl(data) {
    if (this.notifyUrl == '' || typeof this.notifyUrl == 'undefined'){
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
