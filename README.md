# ionic支付测试

支持微信和支付宝支付，可以完全模拟app支付流程，填写订单信息获取接口地址和其它信息获取订单，点击支付完成app端支付。


## 备注

### 添加平台

```
# 添加ios平台
ionic cordova platform add ios
# 编译
ionic cordova build ios --release


# 添加安装平台
ionic cordova platform add android@6.4.0
# 编译
ionic cordova build android --release
```

### 支付宝插件安装
参考地址：[https://www.jianshu.com/p/d4f103d28a1c](https://www.jianshu.com/p/d4f103d28a1c)、[https://github.com/hhjjj1010/cordova-plugin-alipay-v2](https://github.com/hhjjj1010/cordova-plugin-alipay-v2)

```
cordova plugin add cordova-plugin-alipay-v2 --variable APP_ID=[your AppId]

```

### 微信插件安装
参考地址：[https://blog.csdn.net/chenzao1220/article/details/54933697](https://blog.csdn.net/chenzao1220/article/details/54933697)、[https://github.com/xu-li/cordova-plugin-wechat](https://github.com/xu-li/cordova-plugin-wechat)

```
// 使用2.1版2.3版有问题
ionic cordova plugin add cordova-plugin-wechat@2.1.0 --variable wechatappid=微信appid

```

### 安卓签名

alipay1.keystore 是证书文件名

```
keytool -genkey -alias alipay1.keystore -keyalg RSA -validity 40000 -keystore alipay1.keystore

jarsigner -verbose -keystore alipay1.keystore -signedjar 签名后.apk 签名前.apk alipay1.keystore

```