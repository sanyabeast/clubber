"use strict";
define(["dollaclass"], function($Class){

    var ClubberMath = new $Class({ name : "ClubberMath", namespace : "Plot3" }, {
        vec : {
            static : true,
            value : {
                add : function(out, a, b) {
                    out.x = a.x + b.x
                    out.y = a.y + b.y
                    return out
                },
                normalize : function(out, a) {
                    var x = a.x,
                        y = a.y
                    var len = x*x + y*y
                    if (len > 0) {
                        //TODO: evaluate use of glm_invsqrt here?
                        len = 1 / Math.sqrt(len)
                        out.x = a.x * len
                        out.y = a.y * len
                    }
                    return out
                },
                subtract : function(out, a, b) {
                    out.x = a.x - b.x
                    out.y = a.y - b.y
                    return out
                },
                dot : function(a, b) {
                    return a.x * b.x + a.y * b.y
                },
                set : function(out, x, y) {
                    out.x = x
                    out.y = y
                    return out
                },
                normal : function(out, dir, inverted) {
                    //get perpendicular
                    inverted ? this.set(out, dir.y, -dir.x) : this.set(out, -dir.y, dir.x)
                    return out
                },
                direction : function(out, a, b) {
                    //get unit dir of two lines
                    this.subtract(out, a, b)
                    this.normalize(out, out)
                    return out
                }
            }
        },
        num : {
            static : true,
            value : {
                nearestMult : function(num, div, greater, include){
                    return (greater ? Math.ceil((num + (include?0:1))/div)*div : Math.floor((num - (include?0:1))/div)*div) || 0;
                },
                getOrder : function(num){
                    return (num < 0) ? Math.pow(10, 1 / Math.floor(1 / Math.log10(num))) : Math.pow(10, Math.floor(Math.log10(num)));
                },
                nearestPowerOfTwo : function(num, greater){
                    var degree = Math.log2(num);
                    degree = greater ? Math.ceil(degree) : Math.floor(degree);
                    return Math.pow(2, degree);
                },
                numBelongsRange : function(num, range, include){
                    if (include){
                        return (num >= range[0] && num <= range[1]);
                    } else {
                        return (num > range[0] && num < range[1]);
                    }
                }
            },
            
        },
        rand : {
            static : true,
            value : {
                fromArray : function(arr){
                    return arr[Math.floor(Math.random() * arr.length)];
                },
                str : function(length, allowNums, prefix, suffix){
                    length = length || 8;

                    var randString = "";

                    while (randString.length < length){
                        randString = randString + (Math.random().toString(32).substring(3, 12));
                        if (!allowNums) randString = randString.replace(/\d/g,'');
                    }

                    randString = randString.substring(0, length);
                    return [prefix || "", randString, suffix || ""].join("");
                },
                multipleRandom : function(randomIterations, order){
                    var count = 0;
                    var result = Math.random();
                    order = order || 1;

                    while(count < randomIterations){
                        count++;
                        result = Math.pow(Math.random(), result);
                        // result *= (Math.random());
                    }

                    result *= order;

                    return result;
                }
            }
        },
        extra : {
            static : true,
            value : {
                split2ranges : function(fromValue, toValue, step, targetStep, minChunkSize, maxChunkSize, maxValue){
                    var result = [];

                    if (toValue > maxValue){
                        toValue = maxValue;
                    }

                    if (fromValue > toValue){
                        return result;
                    }

                    var tempFromValue = fromValue;
                    var tempToValue = tempFromValue + (step * Math.min((toValue - fromValue) / step, maxChunkSize));
                    result.push([tempFromValue, tempToValue]);

                    while (tempToValue < toValue){
                        tempFromValue = tempToValue + targetStep;
                        tempToValue = tempFromValue + (step * Math.min((toValue - tempFromValue) / step, maxChunkSize));
                        if (tempToValue - tempFromValue < targetStep * minChunkSize){
                            tempFromValue -= targetStep * minChunkSize;
                        }
                        result.push([tempFromValue, tempToValue]);
                    }


                    return result;
                }
            }
        }
    });

    return ClubberMath;

});