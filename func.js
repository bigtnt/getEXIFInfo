var weidu = 0;
var jingdu = 0;

//触发上传文件功能
function uploadFile(){
	document.getElementById("upfile").click();
};


//上传文件后执行：
function filechange(obj){
	//图片预览
	ImgPreview(obj);
	//输出EXIF信息
	PrintEXIFInfo(obj);
	//渲染Mapbox地图
	RenderMapbox();

	//渲染高德地图
  //	RenderGDMap();

};


//图片预览
function ImgPreview(obj){
	var element = document.getElementById("preview");
	element.src = window.URL.createObjectURL(obj.files[0]);
};

//输出EXIF信息
function PrintEXIFInfo(obj){
	EXIF.getData(obj.files[0],function(){
		document.getElementById("model").innerHTML = "Model：" + EXIF.getTag(this,"Model");
		document.getElementById("datetime").innerHTML = "DateTime：" + EXIF.getTag(this,"DateTime");
		document.getElementById("width").innerHTML = "Width：" + EXIF.getTag(this,"PixelXDimension") + "px";
		document.getElementById("height").innerHTML = "Height：" + EXIF.getTag(this,"PixelYDimension") + "px";
		document.getElementById("exposure").innerHTML = "ExposureTime：" + EXIF.getTag(this,"ExposureTime");
		document.getElementById("fnumber").innerHTML = "FNumber：" + EXIF.getTag(this,"FNumber");
		document.getElementById("iso").innerHTML = "ISOSpeedRatings：" + EXIF.getTag(this,"ISOSpeedRatings");
		document.getElementById("gpsver").innerHTML = "GPSVersionID：" + EXIF.getTag(this,"GPSVersionID");		
		document.getElementById("gpsla").innerHTML = "GPSLatitude：" + EXIF.getTag(this,"GPSLatitude");
		document.getElementById("gpslo").innerHTML = "GPSLongitude：" + EXIF.getTag(this,"GPSLongitude");
		var gps_Latitude = EXIF.getTag(this,"GPSLatitude").toString();
		var gps_Longitude = EXIF.getTag(this,"GPSLongitude").toString();
		weidu = Translate(gps_Latitude);
		jingdu = Translate(gps_Longitude);

	});
};


//经纬度转换单位
function Translate(gpsinfo){
	var str = gpsinfo.split(',');
	for (var i = 0; i <str.length ; i++) {
		str[i]=parseFloat(str[i]);
	};
    var f = parseFloat(str[1]) + parseFloat(str[2]/60);
	var result = parseFloat(str[0])+parseFloat( f/60);
	return result;
};

//渲染地图
function RenderMapbox(){
	mapboxgl.accessToken = 'pk.eyJ1IjoiYjYxMjQwNCIsImEiOiJjam9lYjkzZnoydW94M2tyc2IxMWI1ZTR4In0.eTYNgjrp5JIewtNHpufFCg';
		var map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/streets-v10',
	    center: [0, 0],
		
	});

	map.addControl(new mapboxgl.NavigationControl());

	map.on('load', function () {

		map.addLayer({
		    "id": "points",
		    "type": "symbol",
		    "source": {
		        "type": "geojson",
		        "data": {
		                "type": "Feature",
		                "geometry": {
		                    "type": "Point",
		                    "coordinates": [ jingdu, weidu]
		                },
		                "properties": {
		                    "title": "Here",
		                    "icon": "attraction"
		                }
		            }
		        
		    },
		    "layout": {
		        "icon-image": "{icon}-15",
		        "text-field": "{title}",
		        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
		        "text-offset": [0, 0.6],
		        "text-anchor": "top"
		    }
		});

	});

}


