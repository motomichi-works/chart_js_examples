const ChartTotalLabels = {
  /**
   * options.plugins.{plugin-id} のルールで使用されるid
   * 詳しくは https://www.chartjs.org/docs/4.4.0/developers/plugins.html#plugin-id を参照してください。
   */
  id: 'totalLabels',

  /**
   * 合計値ラベルを描画
   */
  afterDatasetsDraw: function (chart, _args, options) {
    const font = options.font();
    const fontSize = Number(font.size.replace('px', ''));

    ctx = chart.ctx;
    // ラベルの書式設定
    ctx = this.setTextStyle(ctx, fontSize);
    // 各棒最後の項目のメタ情報を取得
    const meta = this.getLastMeta(chart);
    // 各合計値を取得
    const sums = this.calcSums(chart);
    // ラベル描画
    const labels = this.makeLabels(meta, sums, fontSize);
    labels.forEach(function (label) {
      ctx.fillText(label.value, label.x, label.y);
    });
  },

  /**
   * 各項目の合計を取得
   */
  calcSums: function (chart) {
    const valueList = [];
    chart.data.datasets.forEach(function (dataset, i) {
      var meta = chart.getDatasetMeta(i);

      // 非表示の項目は処理しない
      if (meta.hidden) {
        return;
      }
      dataset.data.forEach(function (value, j) {
        if (typeof valueList[j] === 'undefined') {
          valueList[j] = { sum: 0, groupByIndex: [] };
        }

        valueList[j].groupByIndex.push(value);
        valueList[j].sum = valueList[j].sum + value;
      });
    });

    const sums = valueList.map(function(valueItem) {
      const isWillNull = valueItem.sum === 0
        && valueItem.groupByIndex.every(function(item) { return item === null });

      return isWillNull ? null : valueItem.sum;
    })

    return sums;
  },

  /**
   * 各棒最後の項目のメタ情報を取得
   * (非表示のものは除く)
   */
  getLastMeta: function (chart) {
    let i = chart.data.datasets.length - 1;
    let meta = undefined;
    do {
      meta = chart.getDatasetMeta(i);
      i--;
    } while (meta.hidden && i >= 0);

    return meta;
  },

  /**
   * ラベル情報を取得
   */
  makeLabels: function (meta, sums, fontSize) {
    const labels = [];
    sums.forEach(function (sum, i) {
      const labelX = meta.data[i].x;
      const labelY = meta.data[i].y;
      labels.push({
        value: sum === null ? '' : sum.toString(),
        x: labelX,
        y: labelY - fontSize,
      });
    });

    return labels;
  },

  /**
   * 書式設定
   */
  setTextStyle: function (ctx, fontSize) {
    const fontStyle = "bold";
    const fontFamily = "'Helvetica Neue', Helvetica, Arial, sans-serif";
    ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
    ctx.fillStyle = "#666";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    return ctx;
  }
};
