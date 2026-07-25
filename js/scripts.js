$(function () {
    var prices_open = {
        head: { "price-light": 20, "price-full": 35 },
        bust: { "price-light": 30, "price-full": 50 },
        half: { "price-light": 40, "price-full": 70 },
        knee: { "price-light": 50, "price-full": 85 },
        full: { "price-light": 60, "price-full": 100 }
    };

    var prices_surprise = {
        head: { "price-light": 12, "price-full": 28 },
        bust: { "price-light": 20, "price-full": 40 },
        half: { "price-light": 28, "price-full": 55 },
        knee: { "price-light": 35, "price-full": 65 },
        full: { "price-light": 45, "price-full": 80 }
    };

    var prices = prices_open;

    var vgenLinks = {
        open: {
            full: "https://vgen.co/klabisot/service/-rendered-illustration-from-headshot-to-fullbody-/caa6be18-163d-4cb7-9ecd-143f6dffc5bb",
            light: "https://vgen.co/klabisot/service/-colored-sketch-from-headshot-to-fullbody-/68723d07-6049-40d9-b4a5-cdc532f2e603"
        },
        surprise: {
            full: "https://vgen.co/klabisot/service/-surprise-me-rendered-illustration-from-headshot-to-fullbody-/c7a99e55-45ac-46a9-a8ee-8a25e572eae8",
            light: "https://vgen.co/klabisot/service/-surprise-me-colored-sketch-from-headshot-to-fullbody-/3e131ef1-e693-4293-9be1-a025b2bca5c4"
        }
    };

    function updatePaymentLink() {
        var type = $(".comm-type.active").data("type");
        var isFull = $(".price.active").hasClass("price-full");
        var key = isFull ? "full" : "light";
        var url = vgenLinks[type][key];
        $("#payment-vgen").attr("href", url);
    }

    var option_to_class = {
        'Headshot': 'headshot',
        'Bust': 'bust',
        'Half Body': 'halfbody',
        'Knee Up': 'knee',
        'Full Body': 'fullbody'
    };

    var active_option_body = 'fullbody';

    function recalculate() {
        var $cell = $(".price.active");
        var label = $cell.closest("tr").find(".label").text().trim();
        var header = $cell.closest("table").find("th").eq($cell.index()).text().trim();
        var price = parseInt($cell.text());

        var artwork_type = parseInt($('input[name="artwork-type"]:checked').val());
        var bg_price = parseInt($('input[name="bg"]:checked').val());
        var additionals = parseInt($(".opt-btn[data-group=chars].active").data("value"));
        var versions = parseInt($(".opt-btn[data-group=versions].active").data("value"));

        var multiplier = (1 + artwork_type / 100 + bg_price / 100 + additionals * 0.5 + versions * 0.15);
        var total = (price * multiplier).toFixed(2);

        var detail = label + " & " + header + " ($" + price + ")";
        var extras = [];
        if (artwork_type > 0) extras.push("artwork (+" + artwork_type + "%)");
        if (bg_price > 0) extras.push("bg (+" + bg_price + "%)");
        if (additionals > 0) extras.push(additionals + " extra chars (+" + (additionals * 50) + "%)");
        if (versions > 0) extras.push(versions + " alt versions (+" + (versions * 15) + "%)");

        if (extras.length > 0) {
            detail += " + " + extras.join(", ");
        }

        $(".choosen-options").text(detail);
        $(".estimated-price").text("~ $" + total);
        updatePaymentLink();

        active_option_body = label;

        var imgSrc = "img/dorema.png";
        if (header === "Colored Sketch") {
            imgSrc = "img/dorema light.png";
        } else if (header !== "Rendered Illustration") {
            imgSrc = "img/dorema sketch.png";
        }
        $(".preview img").attr("src", imgSrc);
    }

    $(document).on("click", ".price", function () {
        $(".price").removeClass("active");
        $(this).addClass("active");
        recalculate();
        updatePaymentLink();
    });

    $(document).on("click", ".comm-type", function () {
        $(".comm-type").removeClass("active");
        $(this).addClass("active");

        prices = $(this).data("type") === "surprise" ? prices_surprise : prices_open;

        $.each(Object.keys(prices), function (_, shot) {
            $.each(Object.keys(prices[shot]), function (_, render) {
                $("." + shot + " ." + render).text(prices[shot][render]);
            });
        });

        var stepsOpen = "<li>Discussion of your idea and references</li><li>Sketch creation</li><li>Sketch approval</li><li>Invoice and payment</li><li>Rendering/coloring</li><li>Rendering/coloring approval</li><li>Delivery</li>";
        var stepsSurprise = "<li>Submission of your idea and references</li><li>Invoice and payment</li><li>Sketch creation</li><li>Rendering/coloring</li><li>Rendering/coloring approval</li><li>Delivery</li>";

        $(".commission-steps").html($(this).data("type") === "surprise" ? stepsSurprise : stepsOpen);

        recalculate();
        updatePaymentLink();
    });

    $(document).on("click", ".opt-btn", function () {
        var group = $(this).data("group");
        $(".opt-btn[data-group=" + group + "]").removeClass("active");
        $(this).addClass("active");
        recalculate();
    });

    $(document).on("change", "input[name='artwork-type'], input[name='bg']", function () {
        recalculate();
    });

    $(".price").hover(
        function () {
            var $cell = $(this);
            var label = $cell.closest("tr").find(".label").text().trim();
            var klass = option_to_class[label];

            $(".preview-section").removeClass('headshot bust halfbody knee fullbody');
            $(".preview img").removeClass('headshot bust halfbody knee fullbody');
            $(".preview-section").addClass(klass);
            $(".preview img").addClass(klass);
        },
        function () {
            var klass = option_to_class[active_option_body];
            $(".preview-section").removeClass('headshot bust halfbody knee fullbody');
            $(".preview img").removeClass('headshot bust halfbody knee fullbody');
            $(".preview-section").addClass(klass);
            $(".preview img").addClass(klass);
        }
    );

    $(".accordion-header").on("click", function () {
        $(this).parent(".accordion").toggleClass("open");
    });

    var info = {
        nsfw: [
            "Artistic nudity and NSFW",
            "<h3>NSFW meaning:</h3><ul><li>Explicit sexual themes or suggestive context</li><li>Sexual poses or focus on erogenous areas</li><li>Implied or explicit sexual interaction</li><li>Fetish content</li></ul><h3>Artistic nudity is NOT considered NSFW:</h3><ul><li>Nudity presented in a non-sexualized, artistic manner</li><li>Focus on form, anatomy, or expression rather than sexual appeal</li><li>Context that emphasizes beauty, vulnerability, or storytelling without sexual intent</li></ul>"
        ],
        alternative: [
            "Alternative versions",
            "<h3>Alternative versions</h3><ul><li>Alternative versions refer to variations of the same artwork, such as alternative outfit/undressing, hairstyle changes, slight pose adjustments (e.g. small hand/head/eye rotation), minimal background tweaks and so on</li><li>Not considered as alternative versions: a significantly different pose, a new composition, a new full-body orientation, or any change that requires redrawing major parts of the artwork. These will be treated as a separate commission</li><li>Revisions vs. alternative versions: Standard revisions only cover minor fixes. Requests that result in an alternative version (as defined above) after final approval will require an extra fee.</li><li>Pricing: Each alternative version is charged at +15% of the base price</li><li>Examples:<p style='margin-top:5px;'>Alternative outfit (same pose) → alternative version<br>Slight hand/head rotation → alternative version<br>Completely new pose or new composition → separate commission<br></p></li></ul>"
        ]
    };

    $(document).on("click", ".hint", function () {
        var key = $(this).data("info");
        $(".info-header").text(info[key][0]);
        $(".info-description").html(info[key][1]);
        $(".info-window").removeClass("hidden");
    });

    $(document).on("click", ".info-close, .info-window", function () {
        $(".info-window").addClass("hidden");
    });

    recalculate();

    $(document).on("click", ".screenshot-btn", function () {
        var calcAccordion = document.querySelector(".option-selector-container .accordion");
        if (calcAccordion) calcAccordion.classList.add("open");
        var library = document.querySelector(".library");
        var libRect = library.getBoundingClientRect();
        var w = library.offsetWidth;
        var h = library.offsetHeight;
        var origBgImage = library.style.backgroundImage;
        var origBgColor = library.style.backgroundColor;

        var c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        var ctx = c.getContext("2d");

        ctx.fillStyle = "rgb(8, 4, 14)";
        ctx.fillRect(0, 0, w, h);

        var grd1 = ctx.createRadialGradient(w * 0.5, h, 0, w * 0.5, h, h * 0.8);
        grd1.addColorStop(0, "rgb(40, 18, 40)");
        grd1.addColorStop(1, "transparent");
        ctx.fillStyle = grd1;
        ctx.fillRect(0, 0, w, h);

        var grd2 = ctx.createRadialGradient(w * 0.15, h * 0.5, 0, w * 0.15, h * 0.5, w * 0.6);
        grd2.addColorStop(0, "rgb(83, 22, 75)");
        grd2.addColorStop(1, "transparent");
        ctx.fillStyle = grd2;
        ctx.fillRect(0, 0, w, h);

        var grd3 = ctx.createRadialGradient(w * 0.7, h * 0.15, 0, w * 0.7, h * 0.15, w * 0.6);
        grd3.addColorStop(0, "rgb(130, 55, 95)");
        grd3.addColorStop(1, "transparent");
        ctx.fillStyle = grd3;
        ctx.fillRect(0, 0, w, h);

        var grd4 = ctx.createRadialGradient(w * 0.3, h * 0.1, 0, w * 0.3, h * 0.1, w);
        grd4.addColorStop(0, "rgb(109, 42, 109)");
        grd4.addColorStop(1, "transparent");
        ctx.fillStyle = grd4;
        ctx.fillRect(0, 0, w, h);

        document.querySelectorAll("#particles .particle").forEach(function (p) {
            var pr = p.getBoundingClientRect();
            var px = pr.left - libRect.left + pr.width / 2;
            var py = pr.top - libRect.top + pr.height / 2;
            if (px < -20 || py < -20 || px > w + 20 || py > h + 20) return;
            var cs = getComputedStyle(p);
            ctx.globalAlpha = parseFloat(cs.opacity) || 1;
            if (p.classList.contains("line")) {
                var t = cs.transform;
                var angle = 0;
                if (t && t !== "none") {
                    var m = t.match(/matrix\(([^)]+)\)/);
                    if (m) {
                        var parts = m[1].split(", ");
                        angle = Math.atan2(parseFloat(parts[1]), parseFloat(parts[0]));
                    }
                }
                ctx.save();
                ctx.translate(px, py);
                ctx.rotate(angle);
                ctx.fillStyle = "rgba(180, 175, 238, 0.4)";
                ctx.fillRect(-pr.width / 2, -1.5, pr.width, 3);
                ctx.restore();
            } else {
                ctx.fillStyle = cs.backgroundColor || "rgba(179, 100, 80, 0.45)";
                ctx.beginPath();
                ctx.arc(px, py, pr.width / 2, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        ctx.globalAlpha = 1;

        library.style.backgroundColor = "transparent";
        library.style.backgroundImage = "url(" + c.toDataURL() + ")";

        html2canvas(library, {
            scale: 2,
            allowTaint: true,
            useCORS: true,
            backgroundColor: null,
            logging: false
        }).then(function (canvas) {
            library.style.backgroundImage = origBgImage;
            library.style.backgroundColor = origBgColor;
            var link = document.createElement("a");
            link.download = "dreamy-lounge-commission.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
        }).catch(function (err) {
            library.style.backgroundImage = origBgImage;
            library.style.backgroundColor = origBgColor;
            console.error("html2canvas error:", err);
        });
    });
});
