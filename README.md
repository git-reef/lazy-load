# lazy-load
图片的懒加载
### 何为图片的懒加载？
简单来说，当图片（img或background-image）出现在你的可视区域时，才去加载图片的行为就是图片的懒加载。
### 图片懒加载的目的
1、当页面中存在大量图片时，只加载可视区域中的图片要比加载全部图片更加节约流量，同时减少大量请求；<br>
2、可以有效解决大量图片同时加载时出现的卡顿等问题；
### 实现原理
1、该库针对于图片懒加载的实现优先选用IntersectionObserver实现懒加载,但是限于IntersectionObserver在一些浏览器或者低版本的浏览器上不被支持/部分支持（可在此查看 https://caniuse.com/#search=IntersectionObserver ）；<br>2、第二种方法需要配置滚动条所在元素的id，该库当发现IntersectionObserver不被支持时，会使用根据id找到滚动条所在的元素，通过滚动监听实现图片的懒加载，由于滚动监听属于高频触发的事件，对此已在算法和函数节流上做了优化，可放心使用；<br>3、当IntersectionObserver不被支持，同时没有配置滚动条所在元素的id时，会直接通过配置加载全部图片。
### 如何使用
example文件夹中提供了两个demo文件，可做参考。
<br>
##### html中的使用:<br>
img-src中的路径会设置到img标签中的src上或者div的background-image上<br>
img-srcset中的路径会设置到img标签中的srcset上<br>
error-src是在img-src为空字符串时，显示的图片路径，可以用来显示无图片时的默认图片<br>
```
图片：<img class="lazyload" img-src="" error-src="" img-srcset="" alt="">
```

```
背景图：<div class="lazyload" img-src="" error-src=""></div>
```
<br>
##### js中的使用:<br>
```
引入库：<script src="../lazyload.js"></script>
```
<br>

```
使用：window.onload = function () {
	lazyload({
		selector: '.lazyload', 
		scrollElId: 'scroll-element-id'
	});
}
```

### 联系方式
mail: sungf_only@yeah.net



