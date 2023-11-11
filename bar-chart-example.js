(function () {
  // canvas要素を取得
  const ctx = document.getElementById('bar-chart-example');

  // ブレークポイント
  const BREAKPOINTS = {
    lg: 992,
  };

  // X軸のメモリラベル
  const DATA_LABELS = [
    ['10月', '2023年'], // 配列で渡すと改行される
    ['11月'],
    ['12月'],
    ['1月', '2024年'],
    ['2月'],
    ['3月'],
    ['4月'],
    ['5月'],
    ['6月'],
    ['7月'],
    ['8月'],
    ['9月'],
    ['10月'],
  ];

  // 関数
  function isWindowWidthLg() {
    return BREAKPOINTS.lg <= window.innerWidth;
  }

  // newする
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: DATA_LABELS,
      datasets: [
        {
          backgroundColor: '#64b7ba',
          label: 'データセット01',
          data: [
            11111,
            4444,
            6666,
            9999,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
          ],
        },
        {
          backgroundColor: '#eab841',
          label: 'データセット02',
          data: [
            7614,
            8614,
            6614,
            9614,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
          ],
        },
      ],
    },
    options: {
      maintainAspectRatio: false, // 縦横比を自動調整するかどうか
      onResize: function(chartInstance, size) {
        // chartInstanceとsizeを引数で受け取れる
        // sizeはcanvasのstyle属性のwidthとheightに設定された値で、ctx.widthとctx.heightはcanvasのwidth属性とheight属性に設定された値です。詳細はブラウザの開発ツールで確認してください。
        console.log('chartInstance: ', chartInstance);
        console.log('size: ', size);
        console.log('ctx: ', ctx.height);
        console.log('ctx: ', ctx.width);
        console.log('ctx: ', ctx.style);

        // chartInstanceの値を上書きすることでレスポンシブ対応できる
        // あらかじめ取得しておいたctxのstyle属性なども、試してないけどたぶんここで上書きできると思う
        // fontの設定値はここではなく、各fontにコールバックを渡す方が簡単そう
        if (isWindowWidthLg()) {
          // Window幅がlg以上の場合の設定
          chartInstance.data.labels = DATA_LABELS;
          return;
        }

        // Window幅がlg未満の場合の設定
        const dataLabelsForMd = DATA_LABELS.map(function(item){ return item.reverse().join('') });
        chartInstance.data.labels = dataLabelsForMd;
      },
      plugins: {
        // チャート上に表示される値 ( 各datasetごとに別々の色を設定することも可能 )
        datalabels: {
          color: '#ffffff',
          font: function() {
            if (isWindowWidthLg()) {
              return {
                size: '12px',
              };
            }

            // Window幅がlg未満の場合の設定
            return {
              size: '5px',
            };
          },
        },
        totalLabels: {
          font: function() {
            if (isWindowWidthLg()) {
              return {
                size: '14px',
              };
            }

            // Window幅がlg未満の場合の設定
            return {
              size: '6px',
            };
          },
        },
        // 凡例
        legend: {
          display: true,
          labels: {
            font: function() {
              if (isWindowWidthLg()) {
                return {
                  weight: 'bold',
                  size: '16px',
                };
              }

              // Window幅がlg未満の場合の設定
              return {
                weight: 'bold',
                size: '10px',
              };
            },
            usePointStyle: true,
            pointStyle: 'circle', // (usePointStyleと一緒に設定しないと効果ないので注意)
          },
          position: 'bottom',
        },
        // タイトル (タイトルはhtmlとcssで普通に描画してもよさそう)
        title: {
          color: '#555555',
          display: true,
          font: function() {
            if (isWindowWidthLg()) {
              return {
                weight: 'bold',
                size: '24px',
              };
            }

            // Window幅がlg未満の場合の設定
            return {
              weight: 'bold',
              size: '18px',
            };
          },
          padding: {
            bottom: 20,
          },
          text: '棒グラフの例',
        },
      },
      scales: {
        y: {
          stacked: true, // 縦に積む場合はtrue
          suggestedMax: 25000, // 目盛りの最大値を大きめに設定したい場合など ( 本当に固定したい場合は max というプロパティもある )
          ticks: {
            stepSize: 5000, // 目盛り間隔
            color: '#555555', // 目盛りラベルの色
            font: function() {
              if (isWindowWidthLg()) {
                return {
                  size: '16px',
                  weight: 'bold',
                }
              }

              return {
                size: '10px',
                weight: 'bold',
              }
            },
          },
        },
        x: {
          stacked: true, // 縦に積む場合はtrue
          ticks: {
            autoSkip: false, // canvasの幅が狭い場合に目盛りを省略するかどうか ( 目盛りを省略せずに角度をつけて重ならないようにする選択肢もある )
            color: '#555555', // 目盛りラベルの色
            font: function() {
              if (isWindowWidthLg()) {
                return {
                  size: '14px',
                  weight: 'bold',
                }
              }

              return {
                size: '10px',
                weight: 'bold',
              }
            },
            // maxRotation: 90, // canvasの幅が狭いときなどに角度をつけて重ならないようにする
            // minRotation: 90, // canvasの幅が狭いときなどに角度をつけて重ならないようにする
          },
        },
      },
    },
    // 各種プラグインを使用する場合は配列に入れる
    plugins: [
      ChartDataLabels,
      ChartTotalLabels,
    ],
  });
})();
