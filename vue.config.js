var express = require("express");
var app = express();

// 找到数据文件 data.json
var data = require("./data.json");

var seller = data.seller;
var goods = data.goods;
var ratings = data.ratings;

// vue-cli 3.0版本以上的官方文档
module.exports = {
  devServer: {
    // webpack-dev-server 去官网去看具体的参数
    host: "localhost", // 对应的主机
    port: "3000", // 端口号
    // api接口
    before(app) {
      // 商家信息接口  通过这条路由能够拿到商家的所有信息
      app.get("/api/seller", function(request, response) {
        response.json({
          noerr: 0,
          seller: seller
        });
      });
      // 商品接口， 通过此条路由可以获取到所有的菜品
      app.get("/api/goods", function(requset, response) {
        response.json({
          noerr: 0,
          goods: goods
        });
      });
      // 评论接口， 通过此条路由可以获取到所有用户的评论
      app.get("/api/ratings", function(request, response) {
        response.json({
          noerr: 0,
          ratings: ratings
        });
      });
    }
  }
};
