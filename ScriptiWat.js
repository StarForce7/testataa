document.getElementById('button').onclick = function(e){
$("#interactive").show();
$(function() {

    var resultCollector = Quagga.ResultCollector.create({
        capture: true,
        capacity: 20,
        
    });
    var App = {
        init: function() {
            var self = this;
            Quagga.init(this.state, function(err) {
                if (err) {
                    return self.handleError(err);
                }
                App.checkCapabilities();
                Quagga.start();
            });
        },
        handleError: function(err) {
            console.log(err);
        },
        checkCapabilities: function() {
            var track = Quagga.CameraAccess.getActiveTrack();
            var capabilities = {};
            if (typeof track.getCapabilities === 'function') {
                capabilities = track.getCapabilities();
            }
        },
      
        initCameraSelection: function(){
            var streamLabel = Quagga.CameraAccess.getActiveStreamLabel();    
        },
        
        
        
        state: {
            inputStream: {
                type : "LiveStream",
area: { // defines rectangle of the detection/localization area
    top: "40%",    // top offset
    right: "0%",  // right offset
    left: "0%",   // left offset
    bottom: "40%"  // bottom offset
  },
                constraints: {
                    width: {min: 640},
                    height: {min: 480},
                    facingMode: "environment",
                    aspectRatio: {min: 1, max: 2}
                }
            },
            locator: {
                patchSize: "medium",
                halfSample: true
            },
	
            numOfWorkers: navigator.hardwareConcurrency,
            frequency: 7,
locate: false,
            decoder: {
                readers : ["ean_reader","ean_8_reader"]
            },
            //locate: true
        },
        lastResult : null
	
    };

    App.init();

    Quagga.onProcessed(function(result) {
        var drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;
        if (result) {
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(function (box) {
                    return box !== result.box;
                }).forEach(function (box) {
                    Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
                });
            }
            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
            }
            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
            }
        }
    });

    Quagga.onDetected(function(result) {
        var code = result.codeResult.code;
        if (App.lastResult !== code) {
            App.lastResult = code;
            
var countDecodedCodes=0, err=0;
$.each(result.codeResult.decodedCodes, function(id,error){
    if (error.error!=undefined) {
        countDecodedCodes++;
        err+=parseFloat(error.error);
    }
});
if (err/countDecodedCodes < 0.1) {
     $input = $("#haku");
	    $input.val(result.codeResult.code);
	if(String(result.codeResult.code).length == 13){
            $("#interactive").hide();
	    Quagga.stop();
        }}
}

	   

    });

});

}