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
					type: "LiveStream",
					area: {
						top: "40%",
						right: "0%",
						left: "0%",
						bottom: "40%"
					},
					constraints: {
						width: {min: 640},
						height: {min: 480},
						facingMode: "environment",
						aspectRatio: {min: 1, max: 100}
					}
				},
				locator: {
					patchSize: "medium",
					halfSample: true
				},
	
				numOfWorkers: navigator.hardwareConcurrency,
				frequency: 50,
				decoder: {
					readers : ["ean_reader","ean_8_reader","i2of5_reader"],
					debug: {
						drawScanline: false,
						drawBoundingBox: false
					}
				},
				locate: false
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
				}
				if (result.codeResult && result.codeResult.code) {
					Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
				}
			}
		});

		Quagga.onDetected(function(result) {
			var code = result.codeResult.code;
			if (code == "5825314361839"){window.open('sivu2.html', '_self');}
			if (App.lastResult !== code) {
				App.lastResult = code;
            
				var countDecodedCodes=0, err=0;
				$.each(result.codeResult.decodedCodes, function(id,error){
					if (error.error!=undefined) {
						countDecodedCodes++;
						err+=parseFloat(error.error);
					}
				});
				if (err/countDecodedCodes < 0.08) {
					$input = $("#haku");
					$input.val(result.codeResult.code);
					if(String(result.codeResult.code).length >= 13 ){
						$("#interactive").hide();
						Quagga.stop();
					}
				}
			}
		});
	});
	var paalla = 0;
	document.getElementById('valo').onclick = function(e){
		if(paalla === 1){var track = Quagga.CameraAccess.getActiveTrack();
			track.applyConstraints({advanced: [{torch: false}]}); paalla = 0;
		}
		else{
			var track = Quagga.CameraAccess.getActiveTrack();
			track.applyConstraints({advanced: [{torch: true}]});paalla = 1;
		}
	}
}
