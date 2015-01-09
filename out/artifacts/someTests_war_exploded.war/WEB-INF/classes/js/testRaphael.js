/**
 * Created by IntelliJ IDEA.
 * User: Sergey Riskal
 * Date: 20.12.11
 * Time: 14:20
 */
function RaphaelLinearChart(htmlContainer, creationOptions)
{
    // Default options
    this.options = wQuery.extend(true, {}, {
        width:300,
        height:300,
        mode:"linear",
        title:{
            text:"Chart Title",
            marginTop:10,
            titleAttribute:{
                "fill":"#FFFFFF",
                "stroke":"none",
                "text-anchor":"start",
                "font":"100 12px Arial"
            }
        },
        background:{
            bgAttribute:{
                "fill":"#dddddd",
                "stroke":"#000000",
                "stroke-width":0
            },
            marginLeft:0,
            marginRight:0,
            marginTop:20,
            marginBottom:45
        },
        plotArea:{
            attribute:{
                "fill-opacity":0,
                "stroke-width":0
            },
            marginLeft:30,
            marginRight:30,
            marginTop:60,
            marginBottom:65,
            moveCallback:function ()
            {
            }
        },
        grid:{
            enabled:true,
            attribute:{
                "stroke":"#d7d7d9",
                "stroke-width":1
            },
            textAttributeX:{
                "fill":"#000000",
                "stroke":"none",
                "font-size":"11"
            },
            textAttributeY:{
                "fill":"#000000",
                "stroke":"none",
                "font-size":"11",
                "text-anchor":"end"
            }
        },
        points:{
            attribute:{
                "fill-opacity":1,
                "stroke-width":0
            }
        },
        yAxis:{
            mPadding:1.1,
            logYAxis:false,
            logMinVal:-3,
            gridSize:6
        },
        xAxis:{
            minValue:0,
            maxValue:0,
            mPadding:1.1,
            gridSize:6,
            values:[]
        },
        alertBox:{
            textAttribute:{
                "fill":"#000000",
                "stroke":"none",
                "font-size":"11"
            },
            boxAttribute:{
                "fill":"#D10202",
                "stroke":"#000000",
                "stroke-width":1
            },
            boxBorderRadius:2
        },
        warningBox:{
            textAttribute:{
                "fill":"#ffffff",
                "stroke":"none",
                "font-size":"11"
            },
            boxAttribute:{
                "fill":"#425765",
                "stroke":"#000000",
                "stroke-width":1
            },
            boxBorderRadius:2
        },
        loadingShadow:{
            shadowAttribute:{
                "fill":"#FFFFFF",
                "stroke":"#000000",
                "stroke-width":0,
                "fill-opacity":0.5
            },
            textAttribute:{
                "fill":"#000000",
                "stroke":"none",
                "font-size":"11"
            },
            boxBorderRadius:2
        },
        locale:{
            lNoDataWarning: "No data",
            lNoData:"No data",
            lLoading:"Loading",
            loadingImage:null,
            minImage:null,
            maxImage:null,
            loadImageWidth:0,
            loadImageHeight:0,
            scaleLabel:"Scale: ",
            normScaleButtonName:"Normal",
            logScaleButtonName:"Log"
        },
        piechart:{
            cx:100,
            cy:100,
            radius:40,
            segments:[]
        },
        mainChartValues:1,
        lines:[]
    }, creationOptions);
    // Internal variables
    this.paper = new Raphael(htmlContainer, this.options.width, this.options.height);
    this.paper.parentchart = this;
    this.width = 0;
    this.height = 0;
    this.mainChartValues = 1;
    this.plotArea = { x:0, y:0, width:0, height:0 };
    this.xMinValue = 0;
    this.xMaxValue = 0;
    this.yMinValue = 0;
    this.yMaxValue = 0;
    this.pathstrings = [];
    this.criticalTexts = [];
    this.minPoints = [];
    this.maxPoints = [];

    this.background = this.paper.set();
    this.alertBox = this.paper.set();
    this.warningBox = this.paper.set();
    this.loadingShadow = this.paper.set();
    this.vLine = null;
    this.scaleControlsNormal = this.paper.set();
    this.scaleControlsLog = this.paper.set();
    this.interRect = this.paper.set();

    this.lines = [];
    this.points = [];
    this.valrect = [];
    this.legend = [];
    this.piechart = {sectors:[], values:[]};

    // Function: remove all chart elements
    this.removeChart = function ()
    {
        this.background.remove();
        this.background.clear();
        this.alertBox.remove();
        this.alertBox.clear();
        this.warningBox.remove();
        this.warningBox.clear();
        this.loadingShadow.remove();
        this.loadingShadow.clear();
        for(var lkey in this.lines)
        {
            if(this.lines.hasOwnProperty(lkey))
            {
                this.lines[lkey].remove();
            }
        }
        this.lines = [];
        this.criticalTexts = [];
        if(this.vLine != null)
        {
            this.vLine.remove();
        }
        this.vLine = null;
        for(var vkey in this.valrect)
        {
            if(this.valrect.hasOwnProperty(vkey))
            {
                this.valrect[vkey].rect.remove();
                this.valrect[vkey].text.remove();
            }
        }
        this.valrect = [];
        for(var pkey in this.points)
        {
            if(this.points.hasOwnProperty(pkey))
            {
                this.points[pkey].remove();
            }
        }
        this.points = [];
        for(var lgkey in this.legend)
        {
            if(this.legend.hasOwnProperty(lgkey))
            {
                this.legend[lgkey].remove();
            }
        }
        this.legend = [];
        this.interRect.remove();
        this.interRect.clear();
        this.scaleControlsNormal.remove();
        this.scaleControlsNormal.clear();
        this.scaleControlsLog.remove();
        this.scaleControlsLog.clear();
        for(var skey in this.piechart.sectors)
        {
            if(this.piechart.sectors.hasOwnProperty(skey))
            {
                this.piechart.sectors[skey].remove();
            }
        }

        for(var vlKey in this.piechart.values)
        {
            if(this.piechart.values.hasOwnProperty(vlKey))
            {
                this.piechart.values[vlKey].remove();
            }
        }
        this.piechart = {sectors:[], values:[]};
    };
    // Function: draw background and resize paper

    this.drawBackground = function ()
    {
        // check for error
        if(this.options.width < 1 || this.options.height < 1)
        {
            throw new Error("Wrong width or height for chart. width=" + this.options.width + ", height=" + this.options.height);
        }
        this.width = this.options.width;
        this.height = this.options.height;
        // recalculate plot area size and resize paper
        this.paper.setSize(this.width, this.height);
        this.plotArea = {
            x:this.options.plotArea.marginLeft,
            y:this.options.plotArea.marginTop,
            width:this.options.width - this.options.plotArea.marginLeft - this.options.plotArea.marginRight,
            height:this.options.height - this.options.plotArea.marginTop - this.options.plotArea.marginBottom
        };
        // draw background and title
        var background = this.paper.rect(
            this.options.background.marginLeft,
            this.options.background.marginTop,
            this.options.width - this.options.background.marginLeft - this.options.background.marginRight,
            this.options.height - this.options.background.marginTop - this.options.background.marginBottom,
            5, 0
        ).attr(this.options.background.bgAttribute);
        var title = this.paper.text(0, this.options.title.marginTop, this.options.title.text).attr(this.options.title.titleAttribute);
        this.background.push(background);
        this.background.push(title);
        // draw loading shadow and other loading elements
        var shadowRect = this.paper.rect(
            this.plotArea.x,
            this.plotArea.y,
            this.plotArea.width,
            this.plotArea.height,
            this.options.background.borderRadius, this.options.background.borderRadius
        ).attr(this.options.loadingShadow.shadowAttribute);
        var cx = this.plotArea.x + (this.plotArea.width) / 2;
        var cy = this.plotArea.y + (this.plotArea.height) / 2;
        if(this.options.locale.loadingImage != null)
        {
            this.loadingShadow.push(this.paper.image(this.options.locale.loadingImage, cx - this.options.locale.loadImageWidth / 2, cy - this.options.locale.loadImageHeight, this.options.locale.loadImageWidth, this.options.locale.loadImageHeight));
            cy += this.options.locale.loadImageHeight + 5;
        }
        var shadowText = this.paper.text(cx, cy, this.options.locale.lLoading).attr(this.options.loadingShadow.textAttribute);
        this.loadingShadow.push(shadowRect);
        this.loadingShadow.push(shadowText);

        var s = this.paper.path("m50 50L40 40 40 10").getBBox();
        alert(s.x+' '+ s.y+' '+ s.x2+' '+ s.y2+' '+ s.height+' '+ s.width);
//        this.paper.path("L0 0");      azaza
        this.hideLoading();
    };
    // Functions: show and hide messages and loading shadow
    this.showLoading = function ()
    {
        this.loadingShadow.show();
        this.loadingShadow.toFront();
    };
    this.hideLoading = function ()
    {
        this.loadingShadow.hide();
        this.loadingShadow.toBack();
    };
    this.showAlert = function (msg)
    {
        var cx = this.plotArea.x + this.plotArea.width / 2;
        var cy = this.plotArea.y + this.plotArea.height / 2;
        var message = this.paper.text(cx, cy, msg).attr(this.options.alertBox.textAttribute);
        var bb = message.getBBox(),
            w = Math.round(bb.width) + 10,
            h = Math.round(bb.height) + 10,
            x = Math.round(bb.x) - 5,
            y = Math.round(bb.y) - 5;
        this.alertBox.push(message);
        this.alertBox.push(this.paper.rect(x, y, w, h, this.options.alertBox.boxBorderRadius).attr(this.options.alertBox.boxAttribute));
        message.toFront();
    };
    this.showWarning = function (msg)
    {
        var cx = this.plotArea.x + this.plotArea.width / 2;
        var cy = this.plotArea.y + this.plotArea.height / 2;
        var message = this.paper.text(cx, cy, msg).attr(this.options.warningBox.textAttribute);
        var bb = message.getBBox(),
            w = Math.round(bb.width) + 10,
            h = Math.round(bb.height) + 10,
            x = Math.round(bb.x) - 5,
            y = Math.round(bb.y) - 5;
        this.warningBox.push(message);
        this.warningBox.push(this.paper.rect(x, y, w, h, this.options.warningBox.boxBorderRadius).attr(this.options.warningBox.boxAttribute));
        message.toFront();
    };
    // Function: calculate boundary values for axis autoscaling
    this.calcAutoscale = function ()
    {
        this.xMinValue = 0;
        this.xMaxValue = 0;
        this.yMinValue = 0;
        this.yMaxValue = 0;
        var absMin = [];
        var absMax = [];
        // find min and max Y values
        for(var lineKey in this.options.lines)
        {
            if(this.options.lines.hasOwnProperty(lineKey))
            {
                if(this.options.lines[lineKey].lineType == "normal")
                {
                    absMin[lineKey] = null;
                    absMax[lineKey] = null;
                    var line = this.options.mainChartValues == 1? this.options.lines[lineKey].values : this.options.mainChartValues == 0
                        ? this.options.lines[lineKey].valuesMax : this.options.lines[lineKey].valuesMin;
                    for(var normValueKey in line)
                    {
                        if(this.options.lines[lineKey].values.hasOwnProperty(normValueKey))
                        {
//                            var val = this.options.lines[lineKey].values[normValueKey];
                            var val = line[normValueKey];
                            if(this.yMaxValue < val)
                            {
                                this.yMaxValue = val;
                            }
                            if(this.yMinValue > val)
                            {
                                this.yMinValue = val;
                            }
                            if(val != null)
                            {
                                if(absMin[lineKey] == null || absMin[lineKey] > val)
                                {
                                    absMin[lineKey] = val;
                                }
                                if(absMax[lineKey] == null || absMax[lineKey] < val)
                                {
                                    absMax[lineKey] = val;
                                }
                            }
                        }
                    }
                } else if(this.options.lines[lineKey].lineType == "square")
                {
                    for(var valueKey in this.options.lines[lineKey].values.values)
                    {
                        if(this.options.lines[lineKey].values.values.hasOwnProperty(valueKey))
                        {
                            if(this.yMaxValue < this.options.lines[lineKey].values.values[valueKey])
                            {
                                this.yMaxValue = this.options.lines[lineKey].values.values[valueKey];
                            }
                            if(this.yMinValue > this.options.lines[lineKey].values.values[valueKey])
                            {
                                this.yMinValue = this.options.lines[lineKey].values.values[valueKey];
                            }
                        }
                    }
                }
            }
        }
        // search for min and max points
        this.minPoints = [];
        this.maxPoints = [];
        for(lineKey in this.options.lines)
        {
            if(this.options.lines.hasOwnProperty(lineKey))
            {
                if(this.options.lines[lineKey].lineType == "normal")
                {
                    var aMax = absMax[lineKey];
                    var aMin = absMin[lineKey];
                    var sensitivityDelta = 0.001;
                    var countMax = 0, countMin = 0;

                    this.minPoints[lineKey] = [];
                    this.maxPoints[lineKey] = [];
                    var lastMax = false, lastMin = false;
                    line = this.options.mainChartValues == 1? this.options.lines[lineKey].values : this.options.mainChartValues == 0
                        ? this.options.lines[lineKey].valuesMax : this.options.lines[lineKey].valuesMin;
                    for(normValueKey in line)
                    {
                        if(this.options.lines[lineKey].values.hasOwnProperty(normValueKey))
                        {
//                            var value = this.options.lines[lineKey].values[normValueKey];
                            var value = line[normValueKey];
                            if(value == null)
                            {
                                countMax++;
                                countMin++;
                            }
                            if(value != null && value <= aMax && value >= aMax - sensitivityDelta)
                            {
                                countMax++;
                                if(!lastMax)
                                {
                                    this.maxPoints[lineKey].push(normValueKey);
                                    lastMax = true;
                                }
                            }
                            else
                            {
                                lastMax = false;
                            }
                            if(value != null && value >= aMin && value <= aMin + sensitivityDelta)
                            {
                                countMin++;
                                if(!lastMin)
                                {
                                    this.minPoints[lineKey].push(normValueKey);
                                    lastMin = true;
                                }
                            }
                            else
                            {
                                lastMin = false;
                            }
                        }
                    }
//                    if(countMax >= this.options.lines[lineKey].values.length)
                    if(countMax >= line.length)
                    {
                        this.maxPoints[lineKey] = [];
                    }
//                    if(countMin >= this.options.lines[lineKey].values.length)
                    if(countMin >= line.length)
                    {
                        this.minPoints[lineKey] = [];
                    }
                }
            }
        }
        if(this.options.yAxis.logYAxis)
        {
            var i = this.options.yAxis.logMinVal;
            while(Math.pow(10, i) < this.yMaxValue)
            {
                i++;
            }
            if (i == -3)
            {
                this.yMaxValue = -1;
            }
            else
            {
                this.yMaxValue = i;
            }
            this.yMinValue = this.options.yAxis.logMinVal;
        }
        else
        {
            if((this.yMaxValue == this.yMinValue) && (this.yMaxValue != 0))
            {
                this.yMinValue = this.yMaxValue - 1;
            }
            if(this.yMinValue > 0)
            {
                this.yMinValue = 0;
            }
            if(this.yMaxValue < 0)
            {
                this.yMaxValue = 1;
            }
            if(this.yMaxValue > 0.5 && this.yMaxValue < 1)
            {
                this.yMaxValue = 1;
            }
            if(this.yMaxValue - this.yMinValue < 0.01)
            {
                this.yMaxValue = 1;
            }
            if(this.yMaxValue >= 4)
            {
                this.yMinValue = Math.ceil(this.yMinValue - (this.yMaxValue * this.options.yAxis.mPadding - this.yMaxValue));
                this.yMaxValue = Math.ceil(this.yMaxValue * this.options.yAxis.mPadding);
            }
            else
            {
                this.yMinValue = this.yMinValue - (this.yMaxValue * this.options.yAxis.mPadding - this.yMaxValue);
                this.yMaxValue = this.yMaxValue * this.options.yAxis.mPadding;
            }
        }
        if(this.options.xAxis.minValue == 0)
        {
            this.xMaxValue = this.options.xAxis.values[this.options.xAxis.values.length - 1];
        }
        else
        {
            this.xMinValue = this.options.xAxis.minValue;
        }
        if(this.options.xAxis.maxValue == 0)
        {
            this.xMinValue = this.options.xAxis.values[0];
        }
        else
        {
            this.xMaxValue = this.options.xAxis.maxValue;
        }

    };
    // Function: draw grid and axis on plot area
    this.drawGrid = function ()
    {
        // draw new
        var x = this.plotArea.x;
        var y = this.plotArea.y;
        var w = this.plotArea.width;
        var h = this.plotArea.height;
        var wv = this.options.xAxis.gridSize;
        var hv = this.options.yAxis.gridSize;
        var path = ["M", Math.round(x), Math.round(y), "L", Math.round(x), Math.round(y + h), Math.round(x + w), Math.round(y + h)];  //rarara
        // draw horizontal lines
        if(this.options.yAxis.logYAxis)
        {
            for(var logStep = Math.pow(10, this.yMinValue); logStep < Math.pow(10, this.yMaxValue); logStep *= 10)
            {
                var yLogPos = this.plotArea.height - this.translateYCoord(logStep) + this.plotArea.y;
                path = path.concat(["M", Math.round(x), yLogPos, "H", Math.round(x + w)]);
                if(logStep != Math.pow(10, this.yMinValue))
                {
                    this.background.push(this.paper.text(this.plotArea.x - 2, yLogPos, logStep).attr(this.options.grid.textAttributeY));
                }
            }
        }
        else
        {
            var deltaY = this.yMaxValue - this.yMinValue;
            var rowHeight = deltaY / hv;
            // draw up 0
            for(var iUp = 0; iUp < this.yMaxValue; iUp += rowHeight)
            {
                var yUpPos = this.plotArea.height - this.translateYCoord(iUp) + this.plotArea.y;
                path = path.concat(["M", Math.round(x), yUpPos , "H", Math.round(x + w)]);
                var outUpText;
                if(this.yMaxValue < 5)
                {
                    outUpText = Math.round(iUp * 100) / 100;
                }
                else
                {
                    outUpText = Math.round(iUp);
                }
                this.background.push(this.paper.text(this.plotArea.x - 2, yUpPos, outUpText).attr(this.options.grid.textAttributeY));
            }
            // draw down 0
            for(var iDown = 0; iDown > this.yMinValue; iDown -= rowHeight)
            {
                if(iDown == 0)
                {
                    continue;
                }
                var yDownPos = this.plotArea.height - (this.translateYCoord(iDown)) + this.plotArea.y;
                path = path.concat(["M", Math.round(x), yDownPos , "H", Math.round(x + w)]);
                var outDownText;
                if(this.yMaxValue < 5)
                {
                    outDownText = Math.round(iDown * 100) / 100;
                }
                else
                {
                    outDownText = Math.round(iDown);
                }
                this.background.push(this.paper.text(this.plotArea.x - 2, yDownPos, outDownText).attr(this.options.grid.textAttributeY));
            }
        }
        // draw vertical lines
        var start = this.xMinValue;
        var end = this.xMaxValue;
        var interval = end - start;
        var customGridInterval = 0;
        var dateFormat = "";
        if(interval <= 30 * 60 * 1000)
        {            // 30 minutes
            customGridInterval = 5 * 60 * 1000;       // 5 minutes 6p
            dateFormat = "days+hours";
        } else if(interval <= 60 * 60 * 1000)
        {     // 1 hour
            customGridInterval = 10 * 60 * 1000;      // 10 minutes 6p
            dateFormat = "days+hours";
        } else if(interval <= 3 * 60 * 60 * 1000)
        {   // 3 hours
            customGridInterval = 30 * 60 * 1000;      // 30 minutes 6p
            dateFormat = "days+hours";
        } else if(interval <= 6 * 60 * 60 * 1000)
        {   // 6 hours
            customGridInterval = 60 * 60 * 1000;      // 1 hour 6p
            dateFormat = "days+hours";
        } else if(interval <= 12 * 60 * 60 * 1000)
        {  // 12 hours
            customGridInterval = 2 * 60 * 60 * 1000;    // 2 hour 6p
            dateFormat = "days+hours";
        } else if(interval <= 24 * 60 * 60 * 1000)
        {  // 24 hours
            customGridInterval = 4 * 60 * 60 * 1000;    // 4 hours 6p
            dateFormat = "days+hours";
        } else if(interval <= 3 * 24 * 60 * 60 * 1000)
        {    // 3 days
            customGridInterval = 12 * 60 * 60 * 1000;       // 24 hours 6p
            dateFormat = "days+hours";
        }
        else
        {
            customGridInterval = (end - start) / this.options.xAxis.gridSize;
            dateFormat = "days+hours";
        }
        var mdt = new Date(this.xMinValue);
        mdt.setMinutes(0);
        mdt.setSeconds(0);
        mdt.setMilliseconds(0);
        for(i = mdt.getTime(); i <= this.xMaxValue; i += customGridInterval)
        {
            var xVal = this.translateXCoord(i);
            if(xVal >= 0)
            {
                path = path.concat(["M", Math.round(x + xVal), Math.round(y), "V", Math.round(y + h)]);
                this.background.push(this.paper.text(Math.round(x + xVal), (Math.round(y + h) + 10), this.getDateString(i, dateFormat)).attr(this.options.grid.textAttributeX));
            }
        }
        this.background.push(this.paper.path(path.join(",")).attr(this.options.grid.attribute));
    };
    // Functions: translate coordinates
    this.log2lin = function (num)
    {
        // breaking of Mathematics!
        if(num < 0.001)
        {
            return -3;
        }
        return Math.log(num) / Math.LN10;
    };
    this.lin2log = function (num)
    {
        return Math.pow(10, num);
    };
    this.translateYCoord = function (y)
    {
        y = (this.options.yAxis.logYAxis) ? (this.log2lin(y)) : y;
        return this.plotArea.height * (y - this.yMinValue) / (this.yMaxValue - this.yMinValue);
    };
    this.translateYValue = function (y)
    {
        y = (this.options.yAxis.logYAxis) ? (this.log2lin(y)) : y;
        return ((this.yMaxValue - this.yMinValue) * y / this.plotArea.height) + this.yMinValue;
    };
    this.translateXCoord = function (x)
    {
        return this.plotArea.width * (x - this.xMinValue) / (this.xMaxValue - this.xMinValue);
    };
    this.translateXValue = function (x)
    {
        return ((this.xMaxValue - this.xMinValue) * x / this.plotArea.width) + this.xMinValue;
    };
    // Function date string formatter
    this.getDateString = function (timestamp, format)
    {
        var formattedDate = "error";
        var d = new Date();
        var currentOffset = d.getTimezoneOffset() * 60000;
        var dt, month, day, hours, minutes;
        if(this.options.serverTimezone != undefined && this.options.serverTimezone != null)
        {
            dt = new Date(timestamp + currentOffset + (parseInt(this.options.serverTimezone)*3600000));
            month = dt.getMonth() + 1;
            day = dt.getDate();
            hours = dt.getHours();
            minutes = dt.getMinutes();
        }
        else
        {
            dt = new Date(timestamp);
            month = dt.getUTCMonth() + 1;
            day = dt.getUTCDate();
            hours = dt.getUTCHours();
            minutes = dt.getUTCMinutes();
        }
        if(month < 10)
        {
            month = "0" + month;
        }
        if(day < 10)
        {
            day = "0" + day;
        }
        if(minutes < 10)
        {
            minutes = "0" + minutes;
        }
        if(format == 'hours')
        {
            formattedDate = "" + hours + ":" + minutes;
        }
        else if(format == "days")
        {
            formattedDate = "" + day + "." + month;
        }
        else
        {
            formattedDate = "" + day + "." + month + " " + hours + ":" + minutes;
        }
        return formattedDate;
    };
    // Function: build path-strings for drawing
    this.buildPathStrings = function ()
    {
        this.pathstrings = [];
        var crt_i = 0;
        var timestamps = this.options.xAxis.values;
        var pointsCount = timestamps.length;
        if(pointsCount < 1)
        {
            return;
        }
        for(var lineKey in this.options.lines)
        {
            if(this.options.lines.hasOwnProperty(lineKey))
            {
                var line = this.options.mainChartValues == 1 ? this.options.lines[lineKey].values : this.options.mainChartValues == 0
                    ? this.options.lines[lineKey].valuesMax : this.options.lines[lineKey].valuesMin;
                var path = "";
                var attributes = this.options.lines[lineKey].attribute;
//                var values = this.options.lines[lineKey].values;
                var values = line;
                var lastValue = null;
                var x = 0;
                var y = 0;
                if(values.length < 1)
                {
                    continue;
                }
                if(this.options.lines[lineKey].lineType == "normal")
                {
                    for(var normalKey in values)
                    {
                        if(values.hasOwnProperty(normalKey))
                        {
                            if(timestamps[normalKey] == undefined || timestamps[normalKey] == null)
                            {
                                break;
                            }
                            x = this.translateXCoord(timestamps[normalKey]) + this.plotArea.x;
                            if(lastValue == null)
                            {
                                path += "M" + [x, this.plotArea.height - this.translateYCoord(0) + this.plotArea.y] + "L";
                            }
                            if(values[normalKey] != null)
                            {
                                y = this.translateYCoord(values[normalKey]);
                                y = this.plotArea.height - y + this.plotArea.y;
                                path += "," + [x.toFixed(3), y.toFixed(3)];
                                lastValue = y;
                            }
                            else
                            {
                                if(lastValue != null)
                                {
                                    lastValue = null;
                                    path += "," + [(this.translateXCoord(timestamps[normalKey - 1]) + this.plotArea.x).toFixed(3), this.plotArea.height - this.translateYCoord(0) + this.plotArea.y] + "Z";
                                }
                            }
                        }
                    }
                    if(lastValue != null)
                    {
                        path += "," + [x.toFixed(3), this.plotArea.height - this.translateYCoord(0) + this.plotArea.y] + "Z";
                    }
                }
                else if(this.options.lines[lineKey].lineType == "square")
                {
                    x = this.plotArea.x;
                    if((values.values.length < 1 || values.values[0] == null) || (this.options.lines[lineKey].replaceNeeded == true))
                    {
                        continue;
                    }
                    var last_value = values.values[0];
                    /* Start point */

                    y = this.translateYCoord(values.values[0]);
                    y = this.plotArea.height - y + this.plotArea.y;
                    path = "M" + [x, y] + "L";
                    this.criticalTexts[crt_i] = {};
                    var txtval = values.values[0].toFixed(2);

                    // yellow line label displayed below by default
                    if(this.options.lines[lineKey].yellowLineLabeling == true)
                    {
                        this.criticalTexts[crt_i++].options = {x:x + 3, y:y + 7, text:"" + txtval};
                    }
                    else
                    {
                        this.criticalTexts[crt_i++].options = {x:x + 3, y:y - 7, text:"" + txtval};
                    }


                    /* Middle path */
                    for(var key in values.values)
                    {
                        if(values.values.hasOwnProperty(key))
                        {
                            if(values.values[key] != null && last_value != values.values[key])
                            {
                                x = this.translateXCoord(values.timestamps[key]) + this.plotArea.x;
                                y = this.translateYCoord(last_value);
                                y = this.plotArea.height - y + this.plotArea.y;
                                path += "," + [x, y];
                                y = this.translateYCoord(values.values[key]);
                                y = this.plotArea.height - y + this.plotArea.y;
                                path += "," + [x, y];
                                last_value = values.values[key];
                                this.criticalTexts[crt_i] = {};
                                txtval = 0;
                                if(values.values[0] != undefined)
                                {
                                    txtval = values.values[0].toFixed(2);
                                }
                                this.criticalTexts[crt_i++].options = {x:x + 3, y:y - 7, text:"" + txtval};
                            }
                        }
                    }
                    /* End point */
                    if(values.values[values.values.length - 1] == null || (this.options.lines[lineKey].replaceNeeded == true))
                    {
                        continue;
                    }
                    y = this.translateYCoord(values.values[values.values.length - 1]);
                    y = this.plotArea.height - y + this.plotArea.y;
                    path += "," + [this.plotArea.x + this.plotArea.width, y];

                    this.pathstrings.push({"id":this.options.lines[lineKey] + "_back".lineID, "path":path, "attr":{"stroke":"#FFFFFF", "stroke-width":3}});
                }
                this.pathstrings.push({"id":this.options.lines[lineKey].lineID, "path":path, "attr":attributes});
            }
        }
    };
    // Function: draw lines
    this.drawLines = function ()
    {
        for(var lkey in this.pathstrings)
        {
            if(this.pathstrings.hasOwnProperty(lkey))
            {
                this.lines[this.pathstrings[lkey].id] = this.paper.path(this.pathstrings[lkey].path).attr(this.pathstrings[lkey].attr);
            }
        }
        for(var ckey in this.criticalTexts)
        {
            if(this.criticalTexts.hasOwnProperty(ckey))
            {
                this.criticalTexts[ckey].renderer = this.paper.text(this.criticalTexts[ckey].options.x, this.criticalTexts[ckey].options.y, this.criticalTexts[ckey].options.text).attr({"fill":"#000000", "stroke":"none", "text-anchor":"start", "font":"100 10px Arial"});
            }
        }
    };
    // Function: draw other elements
    this.drawElements = function ()
    {
        this.vLine = this.paper.path("M" + [this.plotArea.width + this.plotArea.x, this.plotArea.y] + "L" + [this.plotArea.width + this.plotArea.x, this.plotArea.y + this.plotArea.height]).attr({"stroke":"#000000", "stroke-width":1, "fill-opacity":0});
        this.valrect = [];
        var xPos = this.plotArea.x + this.plotArea.width - 5;
        var normalLinesCount = 0;
        for(var lkey in this.options.lines)
        {
            if(this.options.lines.hasOwnProperty(lkey))
            {
                if(this.options.lines[lkey].lineType == "normal")
                {
                    var pX = this.plotArea.x + this.plotArea.width;
                    var pY = this.translateYCoord(this.options.lines[lkey].values[this.options.lines[lkey].values.length - 1]);
                    pY = this.plotArea.height - pY + this.plotArea.y;
                    var defval = (this.options.lines[lkey].values[this.options.lines[lkey].values.length - 1]);
                    this.points[this.options.lines[lkey].lineID] = this.paper.circle(pX, pY, 4).attr(this.options.points.attribute).attr({"fill":this.options.lines[lkey].attribute.fill});
                    if(defval == undefined)
                    {
                        this.points[this.options.lines[lkey].lineID].hide();
                    }
                    var yPos = this.plotArea.y + 2;
                    this.valrect[this.options.lines[lkey].lineID] = {};
                    defval = (defval != undefined) ? (defval.toFixed(3)) : ("-.---");
                    this.valrect[this.options.lines[lkey].lineID].rect = this.paper.rect(xPos - 55, yPos - 7, 58, 14).attr({"stroke":"none"}).attr({"fill":this.options.lines[lkey].attribute.fill});
                    this.valrect[this.options.lines[lkey].lineID].text = this.paper.text(xPos, yPos, defval).attr({"fill":"#FFFFFF", "stroke":"none", "text-anchor":"end", "font":"100 12px Arial"});
                    if (this.options.minMaxValuesDisplayed)
                    {
                        this.valrect[this.options.lines[lkey].lineID].rectMax = this.paper.rect(xPos - 55, yPos - 7-14, 58, 14).attr({"stroke":"none"}).attr({"fill":this.options.lines[lkey].attribute.fill});
                        this.valrect[this.options.lines[lkey].lineID].textMax = this.paper.text(xPos, yPos-14, defval).attr({"fill":"#FFFFFF", "stroke":"none", "text-anchor":"end", "font":"100 12px Arial"});
                    }
                    if (this.options.minMaxValuesDisplayed)
                    {
                        this.valrect[this.options.lines[lkey].lineID].rectMin = this.paper.rect(xPos - 55, yPos - 7+14, 58, 14).attr({"stroke":"none"}).attr({"fill":this.options.lines[lkey].attribute.fill});
                        this.valrect[this.options.lines[lkey].lineID].textMin = this.paper.text(xPos, yPos+14, defval).attr({"fill":"#FFFFFF", "stroke":"none", "text-anchor":"end", "font":"100 12px Arial"});
                    }
                    xPos -= 60;
                    normalLinesCount++;
                }
            }
        }
        var tmpText = this.getDateString(this.options.xAxis.values[this.options.xAxis.values.length - 1], 'full');

        this.valrect["curtime"] = {};
        this.valrect["curtime"].rect = this.paper.rect(xPos - 115, yPos - 7, 58, 14).attr({"stroke":"none", "fill":"#FFFFFF"});
        this.valrect["curtime"].text = this.paper.text(xPos - 60, yPos, tmpText).attr({"fill":"#000000", "stroke":"none", "text-anchor":"end", "font":"100 12px Arial"});

        if (this.options.minMaxValuesDisplayed)
        {
            this.valrect["maxlabel"] = {};
            this.valrect["maxlabel"].rect = this.paper.rect(xPos - 55, yPos - 7 - 14, 58, 14).attr({"stroke":"none", "fill":"#FFFFFF"});
            this.valrect["maxlabel"].text = this.paper.text(xPos , yPos-14, "MAX: ").attr({"fill":"#000000", "stroke":"none", "text-anchor":"end", "font":"100 12px Arial", "text-align":"left"});
        }

        this.valrect["avglabel"] = {};
        this.valrect["avglabel"].rect = this.paper.rect(xPos - 55, yPos - 7 , 58, 14).attr({"stroke":"none", "fill":"#FFFFFF"});
        this.valrect["avglabel"].text = this.paper.text(xPos , yPos, "AVG: ").attr({"fill":"#000000", "stroke":"none", "text-anchor":"end", "font":"100 12px Arial", "text-align":"left"});
        if (this.options.minMaxValuesDisplayed)
        {
            this.valrect["minlabel"] = {};
            this.valrect["minlabel"].rect = this.paper.rect(xPos - 55, yPos - 7 +14, 58, 14).attr({"stroke":"none", "fill":"#FFFFFF"});
            this.valrect["minlabel"].text = this.paper.text(xPos , yPos+14, "MIN: ").attr({"fill":"#000000", "stroke":"none", "text-anchor":"end", "font":"100 12px Arial", "text-align":"left"});
        }

        yPos = this.options.height - 14;

        // log-normal switcher
        this.background.push(this.paper.text(this.options.width - 330, yPos + 3, this.options.locale.scaleLabel).attr({"fill":"#fff", "stroke":"none", "font":"100 12px Arial", "text-anchor":"end"}))
        var buttonsXPos = this.options.width - 300;
        this.scaleControlsNormal.push(
            this.paper.rect(buttonsXPos, yPos - 7, 120, 20)
                .attr({"stroke":"#000", "cursor":"pointer"})
                .attr((this.options.yAxis.logYAxis) ? {"fill":"#aaa"} : {"fill":"#eee"})
        );
        this.scaleControlsNormal.push(this.paper.text(buttonsXPos + 60, yPos + 3, this.options.locale.normScaleButtonName).attr({"fill":"#000", "stroke":"none", "font":"100 12px Arial", "cursor":"pointer"}))
        buttonsXPos += 150;
        this.scaleControlsLog.push(
            this.paper.rect(buttonsXPos, yPos - 7, 120, 20)
                .attr({"stroke":"#000", "cursor":"pointer"})
                .attr((this.options.yAxis.logYAxis) ? {"fill":"#eee"} : {"fill":"#aaa"})
        );
        this.scaleControlsLog.push(this.paper.text(buttonsXPos + 60, yPos + 3, this.options.locale.logScaleButtonName).attr({"fill":"#000", "stroke":"none", "font":"100 12px Arial", "cursor":"pointer"}));

        this.scaleControlsNormal.click(function ()
        {
            this.paper.parentchart.scaleControlsNormal.attr({"fill":"#aaa"});
            this.paper.parentchart.scaleControlsLog.attr({"fill":"#eee"});
            this.paper.parentchart.options.yAxis.logYAxis = false;
            this.paper.parentchart.redrawChart();
        });

        this.scaleControlsLog.click(function ()
        {
            this.paper.parentchart.scaleControlsNormal.attr({"fill":"#eee"});
            this.paper.parentchart.scaleControlsLog.attr({"fill":"#aaa"});
            this.paper.parentchart.options.yAxis.logYAxis = true;
            this.paper.parentchart.redrawChart();
        });

        var xStep = 250;
        xPos = 500 / normalLinesCount - xStep;

        for(var key = this.options.lines.length - 1; key >= 0; key--)
        {
            if(this.options.lines.hasOwnProperty(key))
            {
                if(this.options.lines[key].lineType == "normal")
                {
                    this.legend[key] = this.paper.set();
                    var rect = this.paper.rect(xPos, yPos - 7, 30, 12).attr({"stroke":"#FFFFFF"}).attr({"fill":this.options.lines[key].attribute.fill});
                    rect.parentLegend = this.legend[key];
                    rect.parentLine = this.lines[this.options.lines[key].lineID];
                    rect.parentPoint = this.points[this.options.lines[key].lineID];
                    rect.toHide = this.paper.set();
                    this.legend[key].status = true;
                    this.legend[key].push(rect);

                    var text = this.paper.text(xPos + 35, yPos, this.options.lines[key].lineLegend).attr({"fill":"#FFFFFF", "stroke":"none", "text-anchor":"start", "font":"100 12px Arial"});
                    text.parentLegend = this.legend[key];
                    text.parentLine = this.lines[this.options.lines[key].lineID];
                    text.parentPoint = this.points[this.options.lines[key].lineID];
                    text.toHide = this.paper.set();
                    this.legend[key].status = true;
                    this.legend[key].push(text);

                    this.legend[key].mouseup(function ()
                    {
                        if(this.parentLegend.status)
                        {
                            this.parentLegend.attr({"stroke-opacity":0});
                            this.parentLine.hide();
                            this.parentPoint.hide();
                            this.parentLegend.status = false;
                        }
                        else
                        {
                            this.parentLegend.attr({"stroke-opacity":1});
                            this.parentLine.show();
                            this.parentPoint.show();
                            this.parentLegend.status = true;
                        }
                    });
                    xPos += xStep;
                }
            }
        }
    };
    // Function: draws minimum and maximum points
    this.drawMinMaxPoints = function ()
    {
        var minImage = this.options.locale.minImage;
        var maxImage = this.options.locale.maxImage;
        var posX, posY, key, lineKey, num, value, timestamp;
        if(minImage != null)
        {
            for(lineKey in this.minPoints)
            {
                if(this.minPoints.hasOwnProperty(lineKey))
                {
                    var line = this.options.mainChartValues == 1 ? this.options.lines[lineKey].values : this.options.mainChartValues == 0
                        ? this.options.lines[lineKey].valuesMax : this.options.lines[lineKey].valuesMin;
                    for(key in this.minPoints[lineKey])
                    {
                        if(this.minPoints[lineKey].hasOwnProperty(key))
                        {
                            num = this.minPoints[lineKey][key];
//                            value = this.options.lines[lineKey].values[num];
                            value = line[num];
                            timestamp = this.options.xAxis.values[num];
                            posX = this.translateXCoord(timestamp) + this.plotArea.x - 8;
                            posY = this.plotArea.height - this.translateYCoord(value) + this.plotArea.y - 18;
                            var m = this.paper.image(minImage, posX, posY, 16, 16);
                            this.background.push(m);
                            break;
                        }
                    }
                }
            }
        }
        if(maxImage != null)
        {
            for(lineKey in this.maxPoints)
            {
                if(this.maxPoints.hasOwnProperty(lineKey))
                {
                    var line = this.options.mainChartValues == 1 ? this.options.lines[lineKey].values : this.options.mainChartValues == 0
                        ? this.options.lines[lineKey].valuesMax : this.options.lines[lineKey].valuesMin;
                    for(key in this.maxPoints[lineKey])
                    {
                        if(this.maxPoints[lineKey].hasOwnProperty(key))
                        {
                            num = this.maxPoints[lineKey][key];
//                            value = this.options.lines[lineKey].values[num];
                            value = line[num];
                            timestamp = this.options.xAxis.values[num];
                            posX = this.translateXCoord(timestamp) + this.plotArea.x - 8;
                            posY = this.plotArea.height - this.translateYCoord(value) + this.plotArea.y - 18;
                            var m = this.paper.image(maxImage, posX, posY, 16, 16);
                            this.background.push(m);
                            break;
                        }
                    }
                }
            }
        }
    };
    // Function: make chart interactive
    this.makeInteractive = function ()
    {
        var xValues = this.options.xAxis.values;
        var xStep = (((this.plotArea.width - this.translateXCoord(xValues[0])) / xValues.length) / 2);
        var xPos = this.plotArea.x;
        var ptY = this.plotArea.y;
        var ptH = this.plotArea.height;
        for(var i = 0; i < xValues.length; i++)
        {
            xPos = this.translateXCoord(xValues[i]) + this.plotArea.x;
            var inRect = this.paper.rect(xPos - xStep, this.plotArea.y, xStep * 2, this.plotArea.height).attr({"stroke":"none", "fill":"#000000", "fill-opacity":0});
            this.interRect.push(inRect);
            inRect.parentChart = this;
            inRect.timeStamp = xValues[i];
            inRect.linesVal = [];
            inRect.mainChart=this.options.mainChartValues;
            for(var lkey in this.options.lines)
            {
                if(this.options.lines.hasOwnProperty(lkey))
                {
                    if(this.options.lines[lkey].lineType == "normal")
                    {
                        inRect.linesVal[this.options.lines[lkey].lineID] = [];
                        inRect.linesVal[this.options.lines[lkey].lineID][0] = this.options.lines[lkey].valuesMax == undefined || this.options.lines[lkey].valuesMax[i] == undefined ? null : (this.options.lines[lkey].valuesMax[i]).toFixed(3);
                        inRect.linesVal[this.options.lines[lkey].lineID][1] = this.options.lines[lkey].values[i] == undefined ? null : (this.options.lines[lkey].values[i]).toFixed(3);
                        inRect.linesVal[this.options.lines[lkey].lineID][2] = this.options.lines[lkey].valuesMin == undefined || this.options.lines[lkey].valuesMin[i] == undefined ? null : (this.options.lines[lkey].valuesMin[i]).toFixed(3);
                    }
                }
            }
            xPos += xStep * 2;
            inRect.hover(function ()
            {
                var posX = this.attrs.x + xStep;
                this.parentChart.vLine.animate({path:"M" + [posX, ptY] + "L" + [posX, ptY + ptH]}, 0);
                var tmpText = this.parentChart.getDateString(this.timeStamp, 'full');
                this.parentChart.valrect["curtime"].text.attr("text", tmpText);

                for(var key in this.linesVal)
                {
                    if(this.linesVal.hasOwnProperty(key))
                    {
                        // Move point
                        var mainValue = this.linesVal[key][this.mainChart];
                        if(mainValue != null && this.parentChart.points[key] != undefined)
                        {
                            this.parentChart.points[key].show();
                            this.parentChart.points[key].attr({
                                "cx":posX,
                                "cy": this.parentChart.plotArea.height - this.parentChart.translateYCoord(mainValue) + this.parentChart.plotArea.y});
                        }
                        else
                        {
                            this.parentChart.points[key].hide();
                        }
                        // Change value texts
                        if(this.parentChart.valrect[key].textMax != undefined && this.parentChart.valrect[key].textMin != undefined )
                        {
                            this.parentChart.valrect[key].textMin.attr("text", this.linesVal[key][2] == null ? "-.---" : this.linesVal[key][2]);
                            this.parentChart.valrect[key].textMax.attr("text", this.linesVal[key][0] == null ? "-.---" : this.linesVal[key][0]);
                        }
                        this.parentChart.valrect[key].text.attr("text", this.linesVal[key][1] == null ? "-.---" : this.linesVal[key][1]);
                    }
                }
                this.parentChart.options.plotArea.moveCallback(this.timeStamp);
            }, function ()
            {
            });
        }
    };
    // Function: draw pie chart sector
    this.drawPieChartSector = function (cx, cy, r, startAngle, endAngle, params, text)
    {
        var rad = Math.PI / 180;
        var x1 = cx + r * Math.cos(-startAngle * rad);
        var x2 = cx + r * Math.cos(-endAngle * rad);
        var y1 = cy + r * Math.sin(-startAngle * rad);
        var y2 = cy + r * Math.sin(-endAngle * rad);
        var delta = endAngle - startAngle;
        var txtX = cx + (r / 2) * Math.cos(-(startAngle + delta / 2) * rad);
        var txtY = cy + (r / 2) * Math.sin(-(startAngle + delta / 2) * rad);
        if(endAngle - startAngle == 360)
        {
            var sector = this.paper.circle(cx, cy, r).attr(params);
        }
        else
        {
            var sector = this.paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
        }
        var textVal = this.paper.text(txtX, txtY, text).attr({stroke:"none", "font-size":10});
        // animate
        sector.mouseover(
            function ()
            {
                sector.stop().animate({transform:"s1.1 1.1 " + cx + " " + cy}, 500, "elastic");
            }).mouseout(function ()
            {
                sector.stop().animate({transform:""}, 500, "elastic");
            });
        this.piechart.sectors.push(sector);
        this.piechart.values.push(textVal);
    };
    // Function: draw pie chart on linear place
    this.drawPieChart = function ()
    {
        var angle = 0;
        var sum = 0;
        for(var key in this.options.piechart.segments)
        {
            sum += this.options.piechart.segments[key].value;
        }
        if(sum == 0)
        {
            return;
        }
        for(var key in this.options.piechart.segments)
        {
            var value = this.options.piechart.segments[key].value;
            if(value <= 0)
            {
                continue;
            }
            var angleplus = 360 * value / sum;
            // build inside text
            var seconds = (Math.floor(this.options.piechart.segments[key].value / 1000) % 60);
            var minutes = (Math.floor(this.options.piechart.segments[key].value / 1000 / 60) % 60);
            var hours = (Math.floor(this.options.piechart.segments[key].value / 1000 / 60 / 60));
            var insideText = this.options.piechart.segments[key].text || hours + "h" + minutes + "m" + seconds + "s";
            this.drawPieChartSector(this.options.piechart.cx, this.options.piechart.cy, this.options.piechart.radius, angle, angle + angleplus, this.options.piechart.segments[key].attribute, insideText);
            angle += angleplus;
        }
    };
    // Function: draw or redraw all chart elements
    this.redrawChart = function ()
    {
        this.removeChart();
        // resize paper and draw new background
        this.drawBackground();
        if(this.options.mode == "linear")
        {
            // draw linear chart
            if(this.options.xAxis.values == null || this.options.xAxis.values.length < 1)
            {
                // show alert "data not found";
                this.showAlert(this.options.locale.lNoData);
            }
            else
            {
                // find max and min values for yAxis
                this.calcAutoscale();
                // draw grid and axis-values
                this.drawGrid();
                // prepare path-strings for drawing
                this.buildPathStrings();
                // draw all paths
                this.drawLines();
                // show warning "no data"

                var haveToShow = true;
                //by default first and secoond lines are tx and rx values
                for(var lineNumber=0; lineNumber<2; lineNumber++)
                {
                    for(var i=0 ;i<this.options.lines[lineNumber].values.length; i++)
                    {
                        if(this.options.lines[lineNumber].values[i] != null && this.options.lines[lineNumber].values[i] != undefined)
                        {
                            haveToShow = false;
                            break;
                        }
                    }
                    //no need to ckeck second line if the first one contains not null values
                    if(!haveToShow)
                    {
                        break;
                    }
                }

                if(haveToShow)
                {
                    this.showWarning(this.options.locale.lNoDataWarning);
                }
                else
                {
                    // prepare points, vertical line and other
                    this.drawElements();
                    // draw min and max points
                    this.drawMinMaxPoints();
                    // make interactive
                    this.makeInteractive();
                }

            }
        }
        else
        {
            // draw pie chart
            this.drawPieChart();
        }
    };
}
