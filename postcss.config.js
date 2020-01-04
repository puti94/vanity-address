module.exports = {
  plugins: {
    autoprefixer: {},
    "postcss-px2rem-exclude": {
      remUnit: 37.5,  //转换为rem的基准px
      // exclude: /node_modules|folder_name/i
      //其他配置选项自行查文档
    
    }
  }
}
