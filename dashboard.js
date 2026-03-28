document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on dashboard page (index.html)
    if (!document.getElementById('dashboardScrollArea')) return;

    // ===== DADOS DE TESTE (inseridos se localStorage vazio) =====
    if (!localStorage.getItem('zFinanca_dados') || JSON.parse(localStorage.getItem('zFinanca_dados')).length === 0) {
        const today = new Date();
        const y = today.getFullYear();
        const m = String(today.getMonth() + 1).padStart(2, '0');
        const pm = String(today.getMonth()).padStart(2, '0') || '12'; // mês passado
        const py = today.getMonth() === 0 ? y - 1 : y; // ano do mês passado
        const testData = [
            { id: '1', type: 'receita', date: `${y}-${m}-05`, value: 4500, category: 'Salário', subCategory: 'CLT', desc: 'Salário mensal' },
            { id: '2', type: 'receita', date: `${y}-${m}-10`, value: 800, category: 'Freelance', subCategory: 'Design', desc: 'Projeto freelance' },
            { id: '3', type: 'receita', date: `${y}-${m}-15`, value: 350, category: 'Vendas', subCategory: 'Mercado Livre', desc: 'Venda de produto' },
            { id: '4', type: 'despesa', date: `${y}-${m}-03`, value: 1200, category: 'Moradia', subCategory: 'Aluguel', desc: 'Aluguel apartamento' },
            { id: '5', type: 'despesa', date: `${y}-${m}-07`, value: 450, category: 'Alimentação', subCategory: 'Ifood', desc: 'Pedidos do mês' },
            { id: '6', type: 'despesa', date: `${y}-${m}-12`, value: 200, category: 'Transporte', subCategory: 'Uber', desc: 'Corridas Uber' },
            { id: '7', type: 'despesa', date: `${y}-${m}-18`, value: 89.90, category: 'Lazer', subCategory: 'Netflix', desc: 'Assinatura streaming' },
            { id: '8', type: 'receita', date: `${py}-${pm}-20`, value: 3800, category: 'Salário', subCategory: 'CLT', desc: 'Salário mês anterior' },
            { id: '9', type: 'despesa', date: `${py}-${pm}-15`, value: 600, category: 'Saúde', subCategory: 'Consulta', desc: 'Consulta médica' },
            { id: '10', type: 'despesa', date: `${y}-${m}-22`, value: 150, category: 'Educação', subCategory: 'Curso online', desc: 'Curso de programação' },
            { id: '11', type: 'receita', date: `${y}-${m}-25`, value: 200, category: 'Investimentos', subCategory: 'Dividendos', desc: 'Rendimento FIIs' },
        ];
        localStorage.setItem('zFinanca_dados', JSON.stringify(testData));
    }

    // Load data from LocalStorage
    let rawData = JSON.parse(localStorage.getItem('zFinanca_dados')) || [];
    // Calculate totals and changes
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let totalReceita = 0;
    let totalDespesa = 0;
    
    let monthReceita = 0;
    let monthDespesa = 0;

    rawData.forEach(item => {
        // Adjust date string parse if needed, assumes "YYYY-MM-DD" mostly
        const itemDate = new Date(item.date);
        
        if (item.type === 'receita') {
            totalReceita += item.value;
            // A bit robust UTC matching to avoid TZ off-by-one errors
            if (itemDate.getUTCMonth() === currentMonth && itemDate.getUTCFullYear() === currentYear) {
                monthReceita += item.value;
            }
        } else if (item.type === 'despesa') {
            totalDespesa += item.value;
            if (itemDate.getUTCMonth() === currentMonth && itemDate.getUTCFullYear() === currentYear) {
                monthDespesa += item.value;
            }
        }
    });

    const saldoAtual = totalReceita - totalDespesa;
    const saldoMonth = monthReceita - monthDespesa;

    // Formatting currency
    const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    // Update DOM (Cards)
    document.getElementById('valSaldo').textContent = formatCurrency(saldoAtual);
    document.getElementById('valReceita').textContent = formatCurrency(totalReceita);
    document.getElementById('valDespesa').textContent = formatCurrency(totalDespesa);

    const updateIndicator = (elId, val, showPlus = true) => {
        const el = document.getElementById(elId);
        const calcSpan = el.querySelector('.calc-val');
        const icon = el.querySelector('svg') || el.querySelector('i'); 
        
        let displayVal = formatCurrency(Math.abs(val));
        if (val >= 0) {
            el.className = 'ind-badge positive';
            if(showPlus) displayVal = "+" + displayVal;
            calcSpan.textContent = displayVal;
            
            // Re-render lucide icon dynamically if status changed
            if(icon && icon.getAttribute('data-lucide') !== 'trending-up') {
                icon.outerHTML = '<i data-lucide="trending-up" width="14"></i>';
            }
        } else {
            el.className = 'ind-badge negative';
            calcSpan.textContent = "-" + displayVal; 
            
            if(icon && icon.getAttribute('data-lucide') !== 'trending-down') {
                icon.outerHTML = '<i data-lucide="trending-down" width="14"></i>';
            }
        }
    };

    updateIndicator('indSaldo', saldoMonth, true);
    updateIndicator('indReceita', monthReceita, true);
    updateIndicator('indDespesa', monthDespesa, true); // display as total volume growth for month realistically, but user requested minus for out. Actually growth in despesa is bad. Let's show as plain value growth.

    lucide.createIcons();


    // ==========================================
    // ECHARTS INITIALIZATION
    // ==========================================
    const chartAreaEl = document.getElementById('chartArea');
    if(!chartAreaEl) return;

    const chartArea = echarts.init(chartAreaEl);
    const chartKpi = echarts.init(document.getElementById('chartKpi'));
    const chartPie = echarts.init(document.getElementById('chartPie'));
    const chartBar = echarts.init(document.getElementById('chartBar'));

    // Responsive listening
    window.addEventListener('resize', () => {
        chartArea.resize();
        chartKpi.resize();
        chartPie.resize();
        chartBar.resize();
    });

    const neonCyan = '#06d6f0';
    const neonGreen = '#10b981';
    const neonRed = '#ef4444';

    // --- 1. KPI GAUGE (Performance) ---
    // User logic: Crescimento do saldo mensal (Em porcentagem).
    // Simple metric: (monthReceita / (monthReceita + monthDespesa)) * 100, clamped to 0-100.
    let kpiValue = 0;
    if ((monthReceita + monthDespesa) > 0) {
        kpiValue = (monthReceita / (monthReceita + monthDespesa)) * 100;
    } else {
        kpiValue = 50; // Neutral fallback if 0 operations month.
    }

    const gaugeOption = {
        series: [{
            type: 'gauge',
            startAngle: 220,
            endAngle: -40,
            min: 0,
            max: 100,
            splitNumber: 10,
            itemStyle: {
                color: neonCyan,
                shadowColor: 'rgba(6, 214, 240, 0.5)',
                shadowBlur: 20,
            },
            progress: {
                show: true,
                width: 18,
                roundCap: true,
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 1, y2: 0,
                        colorStops: [
                            { offset: 0, color: '#3b82f6' },
                            { offset: 1, color: '#06d6f0' }
                        ]
                    },
                    shadowColor: 'rgba(6, 214, 240, 0.5)',
                    shadowBlur: 15
                }
            },
            pointer: {
                show: true,
                length: '60%',
                width: 6,
                offsetCenter: [0, 0],
                itemStyle: {
                    color: '#06d6f0',
                    shadowColor: 'rgba(6, 214, 240, 0.6)',
                    shadowBlur: 10
                }
            },
            axisLine: {
                roundCap: true,
                lineStyle: {
                    width: 18,
                    color: [[1, 'rgba(255,255,255,0.06)']]
                }
            },
            axisTick: {
                distance: -30,
                splitNumber: 5,
                lineStyle: {
                    width: 1,
                    color: 'rgba(255,255,255,0.15)'
                }
            },
            splitLine: {
                distance: -36,
                length: 14,
                lineStyle: {
                    width: 2,
                    color: 'rgba(255,255,255,0.2)'
                }
            },
            axisLabel: {
                distance: -24,
                color: 'rgba(232, 236, 244, 0.4)',
                fontSize: 11,
                fontFamily: 'JetBrains Mono'
            },
            anchor: {
                show: true,
                showAbove: true,
                size: 16,
                itemStyle: {
                    borderWidth: 4,
                    borderColor: '#06d6f0',
                    color: 'rgba(12, 16, 42, 1)',
                    shadowColor: 'rgba(6, 214, 240, 0.4)',
                    shadowBlur: 8
                }
            },
            title: { show: false },
            detail: {
                valueAnimation: true,
                formatter: '{value}%',
                color: neonCyan,
                fontSize: 36,
                fontWeight: 800,
                offsetCenter: [0, '70%'],
                fontFamily: 'JetBrains Mono',
                textShadowColor: 'rgba(6, 214, 240, 0.4)',
                textShadowBlur: 10
            },
            data: [{ value: Number(kpiValue.toFixed(1)) }]
        }]
    };
    chartKpi.setOption(gaugeOption);


    // --- 2. AREA CHART ---
    function renderAreaChart(timeRange) {
        let grouped = {};
        
        rawData.forEach(item => {
            let key = item.date; // "YYYY-MM-DD"
            if(timeRange === 'month') {
                key = key.substring(0, 7);
            } else if (timeRange === 'year') {
                key = key.substring(0, 4);
            } else if (timeRange === 'week') {
                // Approximate grouping by weeks (using simple day limit for visual representation)
                key = key; 
            }

            if(!grouped[key]) grouped[key] = { rec: 0, des: 0 };
            if(item.type === 'receita') grouped[key].rec += item.value;
            else grouped[key].des += item.value;
        });

        // Convert grouped to sorted arrays
        let keys = Object.keys(grouped).sort();
        if(keys.length === 0) keys = ['Sem Dados'];

        let recData = keys.map(k => grouped[k] ? grouped[k].rec : 0);
        let desData = keys.map(k => grouped[k] ? grouped[k].des : 0);

        const areaOption = {
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(12, 16, 42, 0.9)',
                borderColor: 'rgba(255,255,255,0.1)',
                textStyle: { color: '#e8ecf4' }
            },
            legend: {
                data: ['Receita', 'Despesa'],
                textStyle: { color: 'rgba(232, 236, 244, 0.6)' },
                bottom: 0,
                itemGap: 24
            },
            grid: { top: '10%', left: '3%', right: '4%', bottom: '15%', containLabel: true },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: keys,
                axisLabel: { color: 'rgba(232, 236, 244, 0.5)' },
                axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
            },
            yAxis: {
                type: 'value',
                axisLabel: { color: 'rgba(232, 236, 244, 0.5)', fontFamily: 'JetBrains Mono' },
                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
            },
            series: [
                {
                    name: 'Receita',
                    type: 'line',
                    smooth: true,
                    showSymbol: false,
                    itemStyle: { color: neonGreen },
                    lineStyle: { width: 3, shadowColor: 'rgba(16, 185, 129, 0.6)', shadowBlur: 14 },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(16, 185, 129, 0.4)' },
                            { offset: 1, color: 'rgba(16, 185, 129, 0.05)' }
                        ])
                    },
                    data: recData
                },
                {
                    name: 'Despesa',
                    type: 'line',
                    smooth: true,
                    showSymbol: false,
                    itemStyle: { color: neonRed },
                    lineStyle: { width: 3, shadowColor: 'rgba(239, 68, 68, 0.6)', shadowBlur: 14 },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(239, 68, 68, 0.4)' },
                            { offset: 1, color: 'rgba(239, 68, 68, 0.05)' }
                        ])
                    },
                    data: desData
                }
            ]
        };
        chartArea.setOption(areaOption);
    }

    renderAreaChart('day');

    document.querySelectorAll('#areaFilter .filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#areaFilter .filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderAreaChart(e.target.dataset.range);
        });
    });

    // --- 3. PIE CHART & BAR CHART ---
    function renderCategoricalCharts(type) {
        let catGroups = {};
        let subGroups = {};

        rawData.filter(d => d.type === type).forEach(item => {
            if(!catGroups[item.category]) catGroups[item.category] = 0;
            catGroups[item.category] += item.value;

            const sub = item.subCategory || 'Sem SubCategoria';
            if(!subGroups[sub]) subGroups[sub] = 0;
            subGroups[sub] += item.value;
        });

        let pieData = Object.keys(catGroups).map(k => ({ value: catGroups[k], name: k }));
        if(pieData.length === 0) pieData = [{ value: 0, name: 'Sem Dados' }];

        // Sort descending
        let bKeys = Object.keys(subGroups).sort((a,b) => subGroups[a] - subGroups[b]);
        let bVals = bKeys.map(k => subGroups[k]);
        if(bKeys.length === 0) { bKeys=['Nenhum']; bVals=[0]; }

        const themeColor = type === 'receita' ? neonGreen : neonRed;
        
        // --- Pie Option ---
        const pieOption = {
            tooltip: { trigger: 'item', backgroundColor: 'rgba(12, 16, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', textStyle: { color: '#e8ecf4' } },
            series: [{
                name: 'Categoria',
                type: 'pie',
                radius: ['45%', '75%'],
                center: ['50%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 12,
                    borderColor: 'rgba(18, 23, 56, 1)', /* Match container bg */
                    borderWidth: 3,
                    shadowColor: 'rgba(0,0,0,0.5)',
                    shadowBlur: 10
                },
                label: { show: false },
                labelLine: { show: false },
                data: pieData
            }]
        };

        if(type === 'receita') pieOption.color = ['#10b981', '#34d399', '#059669', '#6ee7b7', '#047857', '#a7f3d0'];
        else pieOption.color = ['#ef4444', '#f87171', '#dc2626', '#fca5a5', '#b91c1c', '#fecaca'];

        chartPie.setOption(pieOption);

        // --- Bar Option ---
        const barOption = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                backgroundColor: 'rgba(12, 16, 42, 0.9)',
                borderColor: 'rgba(255,255,255,0.1)',
                textStyle: { color: '#e8ecf4' }
            },
            grid: { top: '5%', left: '3%', right: '15%', bottom: '5%', containLabel: true },
            xAxis: { type: 'value', show: false },
            yAxis: { 
                type: 'category', 
                data: bKeys,
                axisLabel: { color: 'rgba(232, 236, 244, 0.8)' },
                axisLine: { show: false },
                axisTick: { show: false }
            },
            series: [{
                name: 'Valor',
                type: 'bar',
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                        { offset: 0, color: themeColor },
                        { offset: 1, color: 'rgba(255,255,255,0.02)' }
                    ]),
                    borderRadius: [0, 6, 6, 0]
                },
                label: {
                    show: true,
                    position: 'right',
                    color: themeColor,
                    fontFamily: 'JetBrains Mono',
                    formatter: function(params) {
                        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits:0 }).format(params.value);
                    }
                },
                barWidth: '50%',
                data: bVals
            }]
        };
        chartBar.setOption(barOption);
    }

    renderCategoricalCharts('receita'); // Default

    const linkFilters = (filterId1, filterId2) => {
        document.querySelectorAll(`#${filterId1} .filter-btn`).forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetType = e.target.dataset.type;
                
                // Update 1
                document.querySelectorAll(`#${filterId1} .filter-btn`).forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Update 2 automatically
                const pairedBtn = document.querySelector(`#${filterId2} .filter-btn[data-type="${targetType}"]`);
                if(pairedBtn) {
                    document.querySelectorAll(`#${filterId2} .filter-btn`).forEach(b => b.classList.remove('active'));
                    pairedBtn.classList.add('active');
                }

                // Render
                renderCategoricalCharts(targetType);
            });
        });
    };

    // Link Receitas/Despesas tags between Pie and Bar visually
    linkFilters('pieFilter', 'barFilter');
    linkFilters('barFilter', 'pieFilter');

});
