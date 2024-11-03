$(document).ready(function () {
  let colorMix = { red: 0, green: 0, blue: 0 };
  const mainCanvas = document.getElementById("mainCanvas");
  const mainCtx = mainCanvas.getContext("2d");
  mainCtx.fillStyle = "white";
  mainCtx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);

  const paintBrush = $("#paintBrush");

  // Function to animate wavy fill effect in the main canvas
  function animateWaveFill(finalColor) {
    anime({
      targets: mainCtx,
      easing: 'easeInOutSine',
      duration: 1200,
      update: function (anim) {
        mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
        mainCtx.fillStyle = finalColor;
        mainCtx.beginPath();
        mainCtx.moveTo(0, mainCanvas.height - (anim.progress / 100) * mainCanvas.height);
        for (let x = 0; x <= mainCanvas.width; x++) {
          mainCtx.lineTo(x, mainCanvas.height - (anim.progress / 100) * mainCanvas.height + Math.sin(x * 0.05) * 10);
        }
        mainCtx.lineTo(mainCanvas.width, mainCanvas.height);
        mainCtx.lineTo(0, mainCanvas.height);
        mainCtx.closePath();
        mainCtx.fill();
      },
      complete: function () {
        mainCtx.fillStyle = finalColor;
        mainCtx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
      }
    });
  }

  // Function to animate brush from left to right across the main canvas while filling
  function animateBrush(colorElement, brushColor, finalColor) {
    const mainCanvasWidth = $(".canvas-container").width();
    const mainCanvasHeight = $(".canvas-container").height();

    // Set initial brush properties
    paintBrush.css({
      display: "block",
      top: mainCanvasHeight - 30,
      left: '5%',
      color: brushColor // Set brush color to match clicked RGB canvas color
    });

    // Animate brush left to right and trigger wavy fill
    anime({
      targets: paintBrush[0],
      left: '95%',
      duration: 1200,
      easing: 'easeInOutQuad',
      update: function(anim) {
        // Match the brush's Y position with the wave fill height
        const brushY = mainCanvasHeight - (anim.progress / 100) * mainCanvas.height;
        paintBrush.css("top", brushY + "px");
      },
      complete: function () {
        paintBrush.css("display", "none");
        animateWaveFill(finalColor);
      }
    });
  }

  // Event handler for clicking on color cans
  $(".color-can").on("click", function () {
    const color = $(this).data("color");
    colorMix[color]++;
    
    const totalClicks = colorMix.red + colorMix.green + colorMix.blue;
    const redPercentage = (colorMix.red / totalClicks) * 100;
    const greenPercentage = (colorMix.green / totalClicks) * 100;
    const bluePercentage = (colorMix.blue / totalClicks) * 100;
    const finalColor = `rgb(${Math.round(redPercentage * 2.55)}, ${Math.round(greenPercentage * 2.55)}, ${Math.round(bluePercentage * 2.55)})`;
    const finalHexColor = tinycolor(finalColor).toHexString();

    animateBrush($(this), $(this).css("background-color"), finalColor);

    // Update final color display
    $("#finalColorHex").text(finalHexColor.toUpperCase());

    // Update click counts and percentages
    $("#redPercentage").text(`${Math.round(redPercentage)}%`);
    $("#redClickCount").text(`${colorMix.red} clicks`);
    $("#greenPercentage").text(`${Math.round(greenPercentage)}%`);
    $("#greenClickCount").text(`${colorMix.green} clicks`);
    $("#bluePercentage").text(`${Math.round(bluePercentage)}%`);
    $("#blueClickCount").text(`${colorMix.blue} clicks`);
  });

  // Copy hex color to clipboard
  $("#copyHex").on("click", function () {
    const hexCode = $("#finalColorHex").text();
    navigator.clipboard.writeText(hexCode).then(() => {
      toastr.success("Hex code copied to clipboard!");
    }).catch(() => {
      toastr.error("Failed to copy hex code.");
    });
  });
});
