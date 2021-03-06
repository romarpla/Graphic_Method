$(document).ready(function() {
    var Base64 = {
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        encode: function(e) {
            var t = "";
            var n, r, i, s, o, u, a;
            var f = 0;
            e = Base64._utf8_encode(e);
            while (f < e.length) {
                n = e.charCodeAt(f++);
                r = e.charCodeAt(f++);
                i = e.charCodeAt(f++);
                s = n >> 2;
                o = (n & 3) << 4 | r >> 4;
                u = (r & 15) << 2 | i >> 6;
                a = i & 63;
                if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 }
                t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
            }
            return t
        },
        decode: function(e) {
            var t = "";
            var n, r, i;
            var s, o, u, a;
            var f = 0;
            e = e.replace(/[^A-Za-z0-9+/=]/g, "");
            while (f < e.length) {
                s = this._keyStr.indexOf(e.charAt(f++));
                o = this._keyStr.indexOf(e.charAt(f++));
                u = this._keyStr.indexOf(e.charAt(f++));
                a = this._keyStr.indexOf(e.charAt(f++));
                n = s << 2 | o >> 4;
                r = (o & 15) << 4 | u >> 2;
                i = (u & 3) << 6 | a;
                t = t + String.fromCharCode(n);
                if (u != 64) { t = t + String.fromCharCode(r) }
                if (a != 64) { t = t + String.fromCharCode(i) }
            }
            t = Base64._utf8_decode(t);
            return t
        },
        _utf8_encode: function(e) {
            e = e.replace(/rn/g, "n");
            var t = "";
            for (var n = 0; n < e.length; n++) {
                var r = e.charCodeAt(n);
                if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) {
                    t += String.fromCharCode(r >> 6 | 192);
                    t += String.fromCharCode(r & 63 | 128)
                } else {
                    t += String.fromCharCode(r >> 12 | 224);
                    t += String.fromCharCode(r >> 6 & 63 | 128);
                    t += String.fromCharCode(r & 63 | 128)
                }
            }
            return t
        },
        _utf8_decode: function(e) {
            var t = "";
            var n = 0;
            var r = c1 = c2 = 0;
            while (n < e.length) {
                r = e.charCodeAt(n);
                if (r < 128) {
                    t += String.fromCharCode(r);
                    n++
                } else if (r > 191 && r < 224) {
                    c2 = e.charCodeAt(n + 1);
                    t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                    n += 2
                } else {
                    c2 = e.charCodeAt(n + 1);
                    c3 = e.charCodeAt(n + 2);
                    t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                    n += 3
                }
            }
            return t
        }
    }

    var next = 1;
    $(".add-more").click(function(e) {
        if (next < 10) {
            e.preventDefault();
            var addto = "#field" + next;
            next = next + 1;
            var newIn = '<br class="remove-me' + next + '"/><br class="remove-me' + next + '"/><span class="add-on remove-me' 
            + next + '">' + next + '</span><input autocomplete="off" class="span2 remove-me' + next + '" id="fieldx' + next 
            + '" name="fieldx' + next + '" type="number" step="0.01" placeholder="Mutiply X"><span class="variable_obj remove-me' 
            + next + '">&nbsp;X</span><span class="variable_obj remove-me' + next + '">&nbsp;+ </span><input autocomplete="off" class="span2 remove-me' 
            + next + '" id="fieldy' + next + '" name="fieldy' + next + '" type="number" step="0.01" placeholder="Mutiply Y"><span class="variable_obj remove-me' 
            + next + '">&nbsp;Y </span> <select class="select_constraints remove-me' + next + '" id="option' + next + '"><option value="-1"><=</option><option value="1">>=</option><option value="0">=</option></select><input autocomplete="off" class="span2" id="field'
            + next + '" name="con' + next +'" type="number" step="0.01" placeholder="Condition"/>';
            var newInput = $(newIn);
            $(addto).after(newInput);
            //$("#field" + next).attr('data-source', $(addto).attr('data-source'));
            $("#count").val(next);
        }
    });

    $(".remove-one").click(function(e) {
        if (next > 1) {
            e.preventDefault();
            var addto = "#field" + next;
            $("#field" + next).remove();
            $(".remove-me" + next).remove();
            next = next - 1;
            $("#count").val(next);
        }
    });

    $("#btn-solve").click(function() {
        var err = false;
        for (i = 1; i <= next; i++) {
            if ($("#field" + i).val().length == 0)
                err = true;
        }

        if ($("#x").val().length == 0 || $("#y").val().length == 0 || err)
            $("#alert").html('<div class="alert alert-danger span4 offset4"><button type="button" class="close" data-dismiss="alert">&times;</button><center><h4>Error:</h4> Invalid input.</center></div>');
        else {
            $("#solve-div").html('<center><img src="static/img/Dual_Ring.gif" width="200" height="200"></center>');
            var data = '{"obj":"' + $("#select_obj").val() + '","x": "' + $("#x").val() + '", "y": "' + $("#y").val() + '", "count": "' + next + '", "constraints": [';

            for (i = 1; i < next; i++) {
                data = data + '{"x":"' + $("#fieldx" + i).val() + '","y":"' + $("#fieldy" + i).val() + '","s":"' + $("#option" + i).val() + '","c":"' + $("#field" + i).val() + '"},';
            }
            data = data + '{"x":"' + $("#fieldx" + next).val() + '","y":"' + $("#fieldy" + next).val() + '","s":"' + $("#option" + next).val() + '","c":"' + $("#field" + next).val() + '"}]}';

            $.ajax({
                url: "/query/" + Base64.encode(unescape(encodeURIComponent(data))),
                success: function(result) {
                    $("#solve-div").html(result);
                    var div = document.getElementById("solve-div")
                    div.classList ? div.classList.add('well') : div.className += ' well';
                }
            });
        }

    });

});