document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("getInfo").addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: extractData,
        },
        (injectionResults) => {
          for (const frameResult of injectionResults)
            updatePopupContent(frameResult.result);
        }
      );
    });
  });
});

function extractData() {
  function imgTxtZuKarte(id1, id2) {
    const icon = document.getElementById(id1);
    const bgPositionY = window
      .getComputedStyle(icon)
      .backgroundPosition.split(" ")[1];
    let suit;
    switch (bgPositionY) {
      case "0px":
        suit = "Schell";
        break;
      case "-25px":
        suit = "Herz";
        break;
      case "-50px":
        suit = "Eichel";
        break;
      case "-75px":
        suit = "Laub";
        break;
      default:
        suit = "Unknown";
        break;
    }
    const txtElement = document.getElementById(id2);
    const rank = txtElement.textContent.trim();
    return suit + " " + rank;
  }
  const cards = Array.from(
    document.querySelectorAll("#meinekarten .karteImg")
  ).map((img) => {
    const match = img.src.match(/\/(\d+)\.jpg$/);
    return match ? match[1] : "Unknown";
  });
  let oberste = document
    .getElementById("geberkarten_karte1")?.src.match(/\/(\d+)\.jpg$/);
  oberste = oberste ? oberste[1] : "Unknown";
  let unterste = document
    .getElementById("geberkarten_karte2")?.src.match(/\/(\d+)\.jpg$/);
  unterste = unterste ? unterste[1] : "Unknown";
  let player2Played = document
    .getElementById("spieler2_karte")?.src.match(/\/(\d+)\.jpg$/);
  player2Played = player2Played ? player2Played[1] : "Unknown";
  let player3Played = document
    .getElementById("spieler3_karte")?.src.match(/\/(\d+)\.jpg$/);
  player3Played = player3Played ? player3Played[1] : "Unknown";
  let player4Played = document
    .getElementById("spieler4_karte")?.src.match(/\/(\d+)\.jpg$/);
  player4Played = player4Played ? player4Played[1] : "Unknown";
  let rechter = imgTxtZuKarte("farbe_angesagt_img", "farbe_angesagt_txt");
  let gezeigt = imgTxtZuKarte("farbe_gezeigt_img", "farbe_gezeigt_txt");

  const stichContainer = document.getElementById("1stich_container");
  const stich = Array.from(stichContainer.querySelectorAll(".karte_mini")).map(img => {
    const match = img.src?.match(/\/(\d+)\.jpg$/);
    return match ? match[1] : "Unknown";
  });
  console.log(stich)
  return {
    cards,
    rechter,
    gezeigt,
    oberste,
    unterste,
    player2Played,
    player3Played,
    player4Played,
  };
}

function updatePopupContent(data) {
  if (data) {
    console.log(data);
    const karten = {
      1: "Weli",
      2: "Schell Sieben",
      3: "Schell Acht",
      4: "Schell Neun",
      5: "Schell Zehn",
      6: "Schell Unter",
      7: "Schell Ober",
      8: "Schell König",
      9: "Schell Ass",
      10: "Herz Sieben",
      11: "Herz Acht",
      12: "Herz Neun",
      13: "Herz Zehn",
      14: "Herz Unter",
      15: "Herz Ober",
      16: "Herz König",
      17: "Herz Ass",
      18: "Eichel Sieben",
      19: "Eichel Acht",
      20: "Eichel Neun",
      21: "Eichel Zehn",
      22: "Eichel Unter",
      23: "Eichel Ober",
      24: "Eichel König",
      25: "Eichel Ass",
      26: "Laub Sieben",
      27: "Laub Acht",
      28: "Laub Neun",
      29: "Laub Zehn",
      30: "Laub Unter",
      31: "Laub Ober",
      32: "Laub König",
      33: "Laub Ass",
    };
    var nameCards = [];
    for (var cardIndex in data.cards) {
      var cardKey = data.cards[cardIndex];
      if (karten[cardKey]) {
        nameCards.push(karten[cardKey]);
      } else {
        nameCards.push("Unknown Card");
      }
    }
    document.getElementById("myCards").textContent = nameCards.join(", ");
    document.getElementById("angesagt").textContent = data.rechter || "N/A";
    document.getElementById("gezeigt").textContent = data.gezeigt || "N/A";
    document.getElementById("oberste").textContent =
      karten[data.oberste] || "N/A";
    document.getElementById("unterste").textContent =
      karten[data.unterste] || "N/A";
    document.getElementById("player2").textContent =
      karten[data.player2Played] || "N/A";
    document.getElementById("player3").textContent =
      karten[data.player3Played] || "N/A";
    document.getElementById("player4").textContent =
      karten[data.player4Played] || "N/A";
  }
}
