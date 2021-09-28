//Default properties of each cell

let defautProperties = {
  text: " ",
  "font-weight": " ",
  "font-style": " ",
  "font-size": 14,
  "text-decoration": " ",
  "text-align": "left",
  "background-color": "white",
  color: "black",
  "font-family": "Noto Sans",
};

let cellData = {
  sheet1: {},
};

let selectedSheet = "sheet1";
let totalSheets = 1;

$(document).ready(function () {
  let cellContainer = $(".input-cell-container");
  // To build the logic of column name dynamically
  for (let i = 1; i <= 100; i++) {
    let ans = "";

    let n = i;

    while (n > 0) {
      let rem = n % 26;
      if (rem == 0) {
        ans = "Z" + ans;
        n = Math.floor(n / 26) - 1;
      } else {
        ans = String.fromCharCode(rem - 1 + 65) + ans;
        n = Math.floor(n / 26);
      }
    }

    // Column and row name generated and appended
    let column = $(
      `<div class="column-name colId-${i}" id="colCod-${ans}">${ans}</div>`
    );
    $(".column-name-container").append(column);
    let row = $(`<div class="row-name" id="rowId-${i}">${i}</div>`);
    $(".row-name-container").append(row);
  }

  for (let i = 1; i <= 100; i++) {
    let row = $(`<div class="cell-row"></div>`);
    for (let j = 1; j <= 100; j++) {
      let colCode = $(`.colId-${j}`).attr("id").split("-")[1];
      let column = $(
        `<div class="input-cell" contenteditable="false" id = "row-${i}-col-${j}" data="code-${colCode}"></div>`
      );
      row.append(column);
    }
    $(".input-cell-container").append(row);
  }

  //   Format the alignment of text appearnce of icon selected on icon bar
  $(".align-icon").click(function () {
    $(".align-icon.selected").removeClass("selected");
    $(this).addClass("selected");
  });

  //    Format the appearance(Bold ,Italic ,Underline) of text appearnce of icon selected on icon bar
  $(".style-icon").click(function () {
    $(".style-icon.selected").removeClass("selected");
    $(this).toggleClass("selected");
  });

  // To select single or multiple rows
  $(".input-cell").click(function (e) {
    if (e.ctrlKey) {
      let [rowId, colId] = getRowCol(this);
      if (rowId > 1) {
        let topCellSelected = $(`#row-${rowId - 1}-col-${colId}`).hasClass(
          "selected"
        );
        if (topCellSelected) {
          $(this).addClass("top-cell-selected");
          $(`#row-${rowId - 1}-col-${colId}`).addClass("bottom-cell-selected");
        }
      }
      if (rowId < 100) {
        let bottomCellSelected = $(`#row-${rowId + 1}-col-${colId}`).hasClass(
          "selected"
        );
        if (bottomCellSelected) {
          $(this).addClass("bottom-cell-selected");
          $(`#row-${rowId + 1}-col-${colId}`).addClass("top-cell-selected");
        }
      }
      if (colId > 1) {
        let leftCellSelected = $(`#row-${rowId}-col-${colId - 1}`).hasClass(
          "selected"
        );
        if (leftCellSelected) {
          $(this).addClass("left-cell-selected");
          $(`#row-${rowId}-col-${colId - 1}`).addClass("right-cell-selected");
        }
      }
      if (colId < 100) {
        let rightCellSelected = $(`#row-${rowId}-col-${colId + 1}`).hasClass(
          "selected"
        );
        if (rightCellSelected) {
          $(this).addClass("right-cell-selected");
          $(`#row-${rowId}-col-${colId + 1}`).addClass("left-cell-selected");
        }
      }
      $(this).addClass("selected");
    } else {
      $(".input-cell.selected").removeClass("selected");
      $(this).addClass("selected");
    }
  });

  // To make cells editable by double clicking on it
  $(".input-cell").dblclick(function () {
    $(".input-cell.selected").removeClass("selected");
    $(this).addClass("selected");
    $(this).attr("contenteditable", "true");
    $(this).focus();
  });

  $(".input-cell").blur(function () {
    $(".input-cell.selected").attr("contenteditable", "false");
  });

  // To make our main sheet scrollable with respective column and row name
  $(".input-cell-container").scroll(function () {
    $(".column-name-container").scrollLeft(this.scrollLeft);
    $(".row-name-container").scrollTop(this.scrollTop);
  });
});

// To generate current cellid
function getRowCol(ele) {
  let idArray = $(ele).attr("id").split("-");
  let rowId = parseInt(idArray[1]);
  let colId = parseInt(idArray[3]);
  return [rowId, colId];
}

function updateCell(property, value, defaultPossible) {
  $(".input-cell.selected").each(function () {
    $(this).css(property, value);
    let [rowId, colId] = getRowCol(this);
    if (cellData[selectedSheet][rowId]) {
      if (cellData[selectedSheet][rowId][colId]) {
        cellData[selectedSheet][rowId][colId][property] = value;
      } else {
        cellData[selectedSheet][rowId][colId] = { ...defaultProperties };
        cellData[selectedSheet][rowId][colId][property] = value;
      }
    } else {
      cellData[selectedSheet][rowId] = {};
      cellData[selectedSheet][rowId][colId] = { ...defaultProperties };
      cellData[selectedSheet][rowId][colId][property] = value;
    }
    if (
      defaultPossible &&
      JSON.stringify(cellData[selectedSheet][rowId][colId]) ===
        JSON.stringify(defaultProperties)
    ) {
      delete cellData[selectedSheet][rowId][colId];
      if (Object.keys(cellData[selectedSheet][rowId]).length == 0) {
        delete cellData[selectedSheet][rowId];
      }
    }
  });
}

// Logic to  make text bold italic or underline as
$(".icon-bold").click(function () {
  if ($(this).hasClass("selected")) {
    updateCell("font-weight", "", true);
  } else {
    updateCell("font-weight", "bold", false);
  }
});

$(".icon-italic").click(function () {
  if ($(this).hasClass("selected")) {
    updateCell("font-style", "", true);
  } else {
    updateCell("font-style", "italic", false);
  }
});

$(".icon-underline").click(function () {
  if ($(this).hasClass("selected")) {
    updateCell("text-decoration", "", true);
  } else {
    updateCell("text-decoration", "underline", false);
  }
});

// Logic to align content in the cell to right , left or middile.

$(".icon-align-right").click(function () {
  if ($(this).hasClass("selected")) {
    updateCell("text-align", "", true);
  } else {
    updateCell("text-align", "right", false);
  }
});

$(".icon-align-left").click(function () {
  if ($(this).hasClass("selected")) {
    updateCell("text-align", "", true);
  } else {
    updateCell("text-align", "left", false);
  }
});

$(".icon-align-center").click(function () {
  if ($(this).hasClass("selected")) {
    updateCell("text-align", "", true);
  } else {
    updateCell("text-align", "center", false);
  }
});
