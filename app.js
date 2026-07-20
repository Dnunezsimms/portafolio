// =============================================================================
// PORTFOLIO ACTIONS & INTERACTIVITY LIBRARIES
// =============================================================================

// 1. DATA AND CONSTANTS FOR THE DYNAMIC MODAL (BILINGUAL)
const PROJECT_DATA_ES = {
    vendimia: {
        meta: "🍇 Ciencia de Datos Agrícolas & XAI",
        title: "Modelación Bioclimática & Predicción de Madurez (Vendimia 5.0)",
        problem: "La viticultura chilena enfrenta desafíos críticos de cambio climático, requiriendo predecir las fechas óptimas de brotación y maduración. Los modelos bioclimáticos tradicionales (GDD) fallan al no considerar variaciones latitudinales ni calibración dinámica del biofix inicial. Además, las curvas de maduración técnica y fenólica recopiladas en viñedos presentaban problemas de leakage (inclusión retrospectiva de datos observados).",
        solution: "Lideré la unificación de la red climatológica del proyecto CORFO y desarrollé un pipeline de cálculo dinámico para porciones de frío y acumulación térmica. Implementé un algoritmo de biofix latitudinal que modela el inicio de acumulación ciego a observaciones de brotación, reduciendo el leakage metodológico. Utilicé modelos Random Forest y Regresión Simbólica (PySR) para descubrir ecuaciones físicas explícitas que acoplan el clima observacional con los azúcares (°Brix), pH y degradación de ácidos en la baya.",
        metrics: [
            "<strong>XAI Explicable:</strong> Integración de SHAP y Feature Permutation Importance para fundamentar decisiones agronómicas.",
            "<strong>Modelamiento del Frío:</strong> Algoritmo Erez-Fishman de frío invernal integrado a nivel horario.",
            "<strong>Biofix Robusto:</strong> Reducción del residuo del biofix de brotación a menos de 5 días a través del modelo latitudinal.",
            "<strong>Optimización:</strong> Base de modelamiento preparada para optimización multiobjetivo NSGA-II."
        ],
        lessons: "El rigor biológico debe prevalecer sobre la optimización ciega del código. Separar el ajuste estadístico retrospectivo (leakage) de la modelación predictiva operacional fue clave para crear un modelo de maduración útil en viñedos comerciales reales. La regresión simbólica con PySR demostró que fórmulas más sencillas y físicamente legibles generalizan mejor que redes neuronales profundas en series agrometeorológicas.",
        pdfLink: "assets/documents/paper_gdd_latitud.pdf",
        dashboardLink: "assets/dashboards/portal_dashboards.html",
        iframeSrc: "assets/dashboards/explorador_frio.html",
        visuals: [
            { path: "assets/images/vendimia_curva_latitudinal.png", caption: "Curva latitudinal Cabernet Sauvignon: DOY observado de brotación y T0 (Biofix) vs latitud." },
            { path: "assets/images/vendimia_paneles_gda.png", caption: "Paneles diagnósticos de acumulación térmica de Grados Día (GDA) para múltiples fundos." },
            { path: "assets/images/vendimia_variedades_vs_latitud.png", caption: "Comportamiento del biofix térmico por variedad comparado con la regresión latitudinal." },
            { path: "assets/images/vendimia_t0_inicio_conteo.png", caption: "Evaluación térmica de la fecha de inicio en el valle de actividad del viñedo." },
            { path: "assets/images/personal/WhatsApp Image 2026-07-07 at 11.29.09.jpeg", caption: "Monitoreo agrometeorológico de vegetación en terreno para validación del modelo bioclimático." },
            { path: "assets/images/personal/WhatsApp Image 2026-07-07 at 11.29.09 (4).jpeg", caption: "Levantamiento de información y muestreo fisiológico directo en hojas de vid." }
        ],
        code: `def calculate_dynamic_chill_portions(temps: np.ndarray) -> np.ndarray:
    """Calculate Chill Portions using the Dynamic Model (Fishman et al., 1987)."""
    temps = np.array(temps, dtype=float)
    # Erez et al constants
    E0 = 4153.5
    E1 = 12888.8
    A0 = 139500.0
    A1 = 2.567e18
    slope = 1.6
    tetmlt = 277.0

    Tk = temps + 273.15
    ftmprt = slope * tetmlt * (Tk - tetmlt) / Tk
    sr = np.exp(ftmprt)

    xi0 = E0 / Tk
    ak1 = A0 * np.exp(-xi0)

    xi1 = E1 / Tk
    ak2 = A1 * np.exp(-xi1)

    inter_e = np.zeros(len(temps))
    portions = np.zeros(len(temps))

    for i in range(1, len(temps)):
        prev_e = inter_e[i-1]
        
        # Intermediate dynamic transition
        inter_e[i] = prev_e * np.exp(-(ak1[i] + ak2[i])) + (ak1[i] / (ak1[i] + ak2[i])) * (1.0 - np.exp(-(ak1[i] + ak2[i])))
        
        if inter_e[i] >= 1.0:
            # If reached 1, it is irreversibly converted into a chill portion
            inter_e[i] = inter_e[i] * (1.0 - sr[i])
            if inter_e[i] < 0:
                inter_e[i] = 0.0
            portions[i] = portions[i-1] + 1.0
        else:
            portions[i] = portions[i-1]

    return portions`
    },
    frayjorge: {
        meta: "🌲 Ecohidrología & Sensores Remotos",
        title: "Flujos de Carbono & Evapotranspiración en Fray Jorge (Paper & Tesis)",
        problem: "Determinar el rol de los ecosistemas semiáridos y áridos en el ciclo de carbono global es clave bajo escenarios de cambio climático. No obstante, modelar continuamente el Net Ecosystem Exchange (NEE) sobre matorrales desérticos chilenos requiere conciliar mediciones micrometeorológicas locales con variables satelitales dispersas en el tiempo, controlando efectos topográficos.",
        solution: "Implementé un flujo de orquestación en Python para procesar registros brutos de una torre de flujo micro-meteorológico (Eddy Covariance) en Bosque Fray Jorge. Entrené modelos Support Vector Regression (SVR) y Random Forest que acoplan el NEE diario con índices NDVI de satélite, humedad del suelo, radiación solar y métricas topográficas, escalando las predicciones a nivel de píxeles continuos de 30m².",
        metrics: [
            "<strong>SVR Model:</strong> Modelamiento en base a doble entrada (óptima vs ecohidrológica) con alta generalización temporal.",
            "<strong>Cómputo Paralelo:</strong> Procesamiento concurrente de píxeles mediante joblib en Python (n_jobs=8).",
            "<strong>Paper Científico:</strong> Manuscrito 'Carbon and water fluxes reveal that one of the world's most arid shrublands functions as a net carbon sink' en peer review.",
            "<strong>Tesis de Magíster:</strong> Investigación de postgrado titulada en la Universidad de Chile."
        ],
        lessons: "La paralelización de procesos espaciales en Python reduce tiempos de cómputo en varios órdenes de magnitud, facilitando el procesamiento masivo de series anuales. En ecosistemas áridos, el desfase temporal entre pulsos de precipitación y la respuesta de la vegetación (NDVI) es la variable de mayor importancia biológica para los algoritmos predictivos.",
        pdfLink: "assets/documents/TESIS_Diego_Nunez_Simms.pdf",
        dashboardLink: "",
        iframeSrc: "",
        visuals: [
            { path: "assets/images/frayjorge_nee_maps.png", caption: "Mapas consolidados de NEE acumulado anual (temporadas 2022 a 2025) a escala de 30m²." },
            { path: "assets/images/frayjorge_nee_curves.png", caption: "Curvas acumuladas de absorción neta de CO2 (Sink Status) en el matorral árido." },
            { path: "assets/images/frayjorge_par_qaqc.png", caption: "Auditoría y control de calidad (QA/QC) de radiación fotosintéticamente activa (PAR)." },
            { path: "assets/images/frayjorge_fig1_shrubland.png", caption: "Distribución y cobertura del matorral xerófilo de Fray Jorge." },
            { path: "assets/images/frayjorge_fig2_climate.png", caption: "Series de temperatura y balances hídricos anuales durante el periodo de estudio." },
            { path: "assets/images/Figure_met_2.png", caption: "Análisis y modelación micrometeorológica de flujos de carbono (SVR pixel prediction)." },
            { path: "assets/images/personal/PXL_20250130_180156714.jpg", caption: "Trabajo de campo: Muestreo de perfiles ecológicos y balances hídricos en matorral xerófilo." }
        ],
        code: `def process_pixel(g, model, predictors):
    g = g.sort_values("fecha_dt")
    # Clean rows with NaNs in predictors to avoid sklearn model failure
    g = g.dropna(subset=predictors)
    
    if len(g) == 0:
        return None
 
    try:
        X = g[predictors]  # Keeps names to prevent warnings
        y_pred = model.predict(X)
    except Exception:
        return None
 
    y_pred = np.asarray(y_pred, dtype=float)
    if len(y_pred) == 0:
        return None
 
    # Robust annual integration (daily mean * 365)
    mean_daily = np.nanmean(y_pred)
    accum = mean_daily * 365
 
    return pd.Series({
        "lon": g["lon"].iloc[0],
        "lat": g["lat"].iloc[0],
        "accum": accum,
        "n_obs": len(y_pred)
    })
 
# Parallel compilation driver (joblib)
results = Parallel(n_jobs=8)(
    delayed(process_pixel)(g, model, predictors)
    for _, g in grouped
)`
    },
    winewise: {
        meta: "☁️ Ingenería de Datos & Validación Climática",
        title: "Pipeline de QA/QC & Validación ERA5-Land vs Observaciones locales",
        problem: "Los datos de reanálisis satelital global (como ERA5-Land) ofrecen cobertura completa, pero exhiben sesgos (bias) significativos en valles agrícolas estrechos o cercanos a la cordillera. Para usarlos de forma segura en modelos enológicos, se requiere un pipeline de validación cruzada y testing que audite el reanálisis frente a estaciones meteorológicas físicas.",
        solution: "Desarrollé una biblioteca modular en Python para estructurar solicitudes de API de ERA5-Land, emparejar espacialmente píxeles con estaciones y realizar análisis QA/QC. Implementé un motor lógico de decisiones para rellenos de gaps basados en correlación y robustecí el código con tests unitarios en Pytest que garantizan la consistencia física de las conversiones de unidades y cálculo de sine-wave GDD.",
        metrics: [
            "<strong>ERA5 Request Builder:</strong> Generación estructurada de peticiones espaciales automatizadas.",
            "<strong>Pytest Coverage:</strong> Tests unitarios automatizados que cubren el procesamiento dinámico.",
            "<strong>Desacoplamiento:</strong> Configuración centralizada mediante archivos YAML.",
            "<strong>Metodología de Limpieza:</strong> Diagrama de flujo explícito para control y relleno de gaps."
        ],
        lessons: "El desarrollo guiado por pruebas (testing) previene fallas lógicas silenciosas en cálculos biofísicos. Por ejemplo, una confusión común en datos de reanálisis es la escala de la precipitación (acumulada horaria vs diaria en metros o milímetros) y la radiación (J/m² a MJ/m²). Un test unitario sencillo previene errores graves en el modelo fenológico aguas abajo.",
        pdfLink: "assets/documents/era5_obj3_short_results.pdf",
        dashboardLink: "",
        iframeSrc: "",
        visuals: [
            { path: "assets/images/winewise_gap_filling_flow.png", caption: "Flujograma de control de calidad (QA/QC) y decisión lógica de relleno de brechas climáticas." },
            { path: "assets/images/winewise_era5_vs_observed.png", caption: "Análisis de correlación y sesgo (bias) de GDD acumulado (ERA5 vs Estación local)." },
            { path: "assets/images/winewise_gdd_vs_elp.png", caption: "Relación de Grados Día (GDD) acumulados con estados fenológicos en 5 fundos." },
            { path: "assets/images/era5_vs_observed_gdd_by_fundo.png", caption: "Correlación estadística acumulada de GDD (ERA5-Land vs observaciones locales)." },
            { path: "assets/images/era5_bias_by_variable_fundo.png", caption: "Análisis de sesgo medio (Temperature Bias) por fundo y variable climatológica." },
            { path: "assets/images/figure_s1.png.jpg", caption: "SIG (Sistema de Información Geográfica): Cartografía espacial de variables climáticas del estudio." }
        ],
        code: `def test_basic_unit_conversions() -> None:
    # Verify Kelvin to Celsius conversions
    assert round(float(kelvin_to_celsius([273.15])[0]), 3) == 0.0
    # Verify meter of water to mm conversion
    assert round(float(precipitation_m_to_mm([0.001])[0]), 3) == 1.0
    # Verify radiation Joules to Megajoules conversion
    assert round(float(joules_to_megajoules([1_000_000])[0]), 3) == 1.0
 
 
def test_wind_and_gdd() -> None:
    # Test wind vector calculations
    assert round(float(compute_wind_speed([3.0], [4.0])[0]), 3) == 5.0
    # Test GDD calculation
    assert round(float(compute_gdd_base([15.0], 10.0)[0]), 3) == 5.0
    # Test single sine GDD function
    assert float(compute_gdd_single_sine([8.0], [20.0], 10.0)[0]) > 0.0`
    }
};

const PROJECT_DATA_EN = {
    vendimia: {
        meta: "🍇 Agricultural Data Science & XAI",
        title: "Bioclimatic Modeling & Maturity Prediction (Vendimia 5.0)",
        problem: "Chilean viticulture faces critical climate change challenges, requiring prediction of optimal budburst and ripening dates. Traditional bioclimatic models (GDD) fail because they do not consider latitudinal variations or dynamic initial biofix calibration. Furthermore, maturation curves collected in vineyards suffered from leakage (retrospective inclusion of observed budburst dates).",
        solution: "I led the unification of the climatological network for the CORFO project and developed a dynamic calculation pipeline for chill portions and thermal accumulation. I implemented a latitudinal biofix algorithm that models the start of accumulation blind to budburst observations, reducing methodological leakage. I utilized Random Forest models and Symbolic Regression (PySR) to discover explicit physical equations coupling observational weather with sugars (°Brix), pH, and organic acid degradation in the berry.",
        metrics: [
            "<strong>Explainable XAI:</strong> Integration of SHAP and Feature Permutation Importance to support agronomic decisions.",
            "<strong>Chill Modeling:</strong> Erez-Fishman Dynamic Chill Portions model integrated at an hourly level.",
            "<strong>Robust Biofix:</strong> Budburst biofix error reduced to less than 5 days via the latitudinal regression model.",
            "<strong>Optimization:</strong> Modeling codebase structured for multi-objective optimization (NSGA-II)."
        ],
        lessons: "Biological rigor must override blind code optimization. Separating retrospective statistical fitting (leakage) from operational predictive modeling was key to creating a maturation model useful in real-world commercial vineyards. Symbolic regression with PySR demonstrated that simpler, physically legible formulas generalize better than deep neural networks in agro-meteorological time-series.",
        pdfLink: "assets/documents/paper_gdd_latitud.pdf",
        dashboardLink: "assets/dashboards/portal_dashboards.html",
        iframeSrc: "assets/dashboards/explorador_frio.html",
        visuals: [
            { path: "assets/images/vendimia_curva_latitudinal.png", caption: "Cabernet Sauvignon latitudinal curve: observed budburst DOY and T0 (Biofix) vs latitude." },
            { path: "assets/images/vendimia_paneles_gda.png", caption: "Diagnostic panels for Growing Degree Days (GDD) accumulation across multiple vineyards." },
            { path: "assets/images/vendimia_variedades_vs_latitud.png", caption: "Thermal biofix behavior by variety compared with the latitudinal regression." },
            { path: "assets/images/vendimia_t0_inicio_conteo.png", caption: "Thermal evaluation of the accumulation start date in the vineyard's activity window." },
            { path: "assets/images/personal/WhatsApp Image 2026-07-07 at 11.29.09.jpeg", caption: "Agro-meteorological field monitoring of vegetation for bioclimatic model validation." },
            { path: "assets/images/personal/WhatsApp Image 2026-07-07 at 11.29.09 (4).jpeg", caption: "Field data collection and direct physiological sampling on grapevine leaves." }
        ],
        code: `def calculate_dynamic_chill_portions(temps: np.ndarray) -> np.ndarray:
    """Calculate Chill Portions using the Dynamic Model (Fishman et al., 1987)."""
    temps = np.array(temps, dtype=float)
    # Erez et al constants
    E0 = 4153.5
    E1 = 12888.8
    A0 = 139500.0
    A1 = 2.567e18
    slope = 1.6
    tetmlt = 277.0

    Tk = temps + 273.15
    ftmprt = slope * tetmlt * (Tk - tetmlt) / Tk
    sr = np.exp(ftmprt)

    xi0 = E0 / Tk
    ak1 = A0 * np.exp(-xi0)

    xi1 = E1 / Tk
    ak2 = A1 * np.exp(-xi1)

    inter_e = np.zeros(len(temps))
    portions = np.zeros(len(temps))

    for i in range(1, len(temps)):
        prev_e = inter_e[i-1]
        
        # Intermediate dynamic transition
        inter_e[i] = prev_e * np.exp(-(ak1[i] + ak2[i])) + (ak1[i] / (ak1[i] + ak2[i])) * (1.0 - np.exp(-(ak1[i] + ak2[i])))
        
        if inter_e[i] >= 1.0:
            # If reached 1, it is irreversibly converted into a chill portion
            inter_e[i] = inter_e[i] * (1.0 - sr[i])
            if inter_e[i] < 0:
                inter_e[i] = 0.0
            portions[i] = portions[i-1] + 1.0
        else:
            portions[i] = portions[i-1]

    return portions`
    },
    frayjorge: {
        meta: "🌲 Ecohydrology & Remote Sensing",
        title: "Carbon Fluxes & Evapotranspiration in Fray Jorge (Paper & Thesis)",
        problem: "Determining the role of arid and semi-arid ecosystems in the global carbon cycle is key under climate change scenarios. However, continuously modeling Net Ecosystem Exchange (NEE) over Chilean desert shrublands requires reconciling local micro-meteorological measurements with satellite variables scattered over time, while controlling for topographic effects.",
        solution: "I implemented a Python orchestration pipeline to process raw micro-meteorological flux tower (Eddy Covariance) records in Fray Jorge Forest. I trained Support Vector Regression (SVR) and Random Forest models that couple daily NEE with satellite NDVI indices, soil moisture, solar radiation, and topographic metrics, scaling predictions to continuous 30m² pixels.",
        metrics: [
            "<strong>SVR Model:</strong> Double-input modeling (optimal vs ecohydrological) showing high temporal generalization.",
            "<strong>Parallel Computing:</strong> Concurrent processing of pixels using joblib in Python (n_jobs=8).",
            "<strong>Scientific Paper:</strong> Manuscript 'Carbon and water fluxes reveal that one of the world\'s most arid shrublands functions as a net carbon sink' in peer review.",
            "<strong>Master's Thesis:</strong> Graduate research project titled and defended at the University of Chile."
        ],
        lessons: "Parallelizing spatial processing in Python reduces computation times by orders of magnitude, enabling massive processing of annual time-series. In arid ecosystems, the lag between rainfall pulses and vegetation response (NDVI) is the variable of greatest biological importance for predictive algorithms.",
        pdfLink: "assets/documents/TESIS_Diego_Nunez_Simms.pdf",
        dashboardLink: "",
        iframeSrc: "",
        visuals: [
            { path: "assets/images/frayjorge_nee_maps.png", caption: "Consolidated annual cumulative NEE maps (2022 to 2025 seasons) at a 30m² scale." },
            { path: "assets/images/frayjorge_nee_curves.png", caption: "Cumulative net CO2 absorption curves (Sink Status) in the arid shrubland." },
            { path: "assets/images/frayjorge_par_qaqc.png", caption: "Quality assurance and control (QA/QC) audit of Photosynthetically Active Radiation (PAR)." },
            { path: "assets/images/frayjorge_fig1_shrubland.png", caption: "Distribution and coverage of xerophytic shrubland in Fray Jorge." },
            { path: "assets/images/frayjorge_fig2_climate.png", caption: "Annual temperature series and water balances during the study period." },
            { path: "assets/images/Figure_met_2.png", caption: "Micro-meteorological analysis and modeling of carbon fluxes (SVR pixel prediction)." },
            { path: "assets/images/personal/PXL_20250130_180156714.jpg", caption: "Fieldwork: ecological profiling and water balances in xerophytic shrubland." }
        ],
        code: `def process_pixel(g, model, predictors):
    g = g.sort_values("fecha_dt")
    # Clean rows with NaNs in predictors to avoid sklearn model failure
    g = g.dropna(subset=predictors)
    
    if len(g) == 0:
        return None
 
    try:
        X = g[predictors]  # Keeps names to prevent warnings
        y_pred = model.predict(X)
    except Exception:
        return None
 
    y_pred = np.asarray(y_pred, dtype=float)
    if len(y_pred) == 0:
        return None
 
    # Robust annual integration (daily mean * 365)
    mean_daily = np.nanmean(y_pred)
    accum = mean_daily * 365
 
    return pd.Series({
        "lon": g["lon"].iloc[0],
        "lat": g["lat"].iloc[0],
        "accum": accum,
        "n_obs": len(y_pred)
    })
 
# Parallel compilation driver (joblib)
results = Parallel(n_jobs=8)(
    delayed(process_pixel)(g, model, predictors)
    for _, g in grouped
)`
    },
    winewise: {
        meta: "☁️ Data Engineering & Climate Validation",
        title: "QA/QC Pipeline & ERA5-Land vs Local Station Validation",
        problem: "Global satellite reanalysis data (such as ERA5-Land) offers complete spatial coverage but exhibits significant biases in narrow agricultural valleys or close to the Andes. To use it safely in winemaking models, a structured pipeline is required to validate the reanalysis against field thermometers, clean gaps, and automatically detect uncalibrated sensors.",
        solution: "I developed a modular Python library to structure ERA5-Land API requests, spatially pair pixels with weather stations, and perform statistical QA/QC. I implemented a decision logic engine for correlation-based gap-filling and robustified the codebase with Pytest unit tests verifying physical consistency of unit conversions and sine-wave GDD calculations.",
        metrics: [
            "<strong>ERA5 Request Builder:</strong> Automated structured generation of spatial queries.",
            "<strong>Pytest Coverage:</strong> Automated unit tests covering the dynamic data processing.",
            "<strong>Decoupling:</strong> Centralized configuration managed through YAML files.",
            "<strong>Cleaning Methodology:</strong> Explicit decision flow diagram for quality control and gap-filling."
        ],
        lessons: "Test-driven development (TDD) prevents silent logical errors in biophysical calculations. For example, a common source of confusion in reanalysis data is precipitation scale (hourly cumulative vs daily in meters or millimeters) and radiation scale (Joules/m² to Megajoules/m²). A simple unit test prevents serious errors in downstream phenological models.",
        pdfLink: "assets/documents/era5_obj3_short_results.pdf",
        dashboardLink: "",
        iframeSrc: "",
        visuals: [
            { path: "assets/images/winewise_gap_filling_flow.png", caption: "Quality control (QA/QC) flow and logical decision flowchart for weather gap-filling." },
            { path: "assets/images/winewise_era5_vs_observed.png", caption: "Correlation and temperature bias analysis of cumulative GDD (ERA5 vs local station)." },
            { path: "assets/images/winewise_gdd_vs_elp.png", caption: "Relationship of cumulative Growing Degree Days (GDD) with phenological stages across 5 vineyards." },
            { path: "assets/images/era5_vs_observed_gdd_by_fundo.png", caption: "Cumulative GDD statistical correlation (ERA5-Land vs local weather stations)." },
            { path: "assets/images/era5_bias_by_variable_fundo.png", caption: "Mean temperature bias analysis by vineyard and meteorological variable." },
            { path: "assets/images/figure_s1.png.jpg", caption: "GIS (Geographic Information System): Spatial mapping of the study's climatological variables." }
        ],
        code: `def test_basic_unit_conversions() -> None:
    # Verify Kelvin to Celsius conversions
    assert round(float(kelvin_to_celsius([273.15])[0]), 3) == 0.0
    # Verify meter of water to mm conversion
    assert round(float(precipitation_m_to_mm([0.001])[0]), 3) == 1.0
    # Verify radiation Joules to Megajoules conversion
    assert round(float(joules_to_megajoules([1_000_000])[0]), 3) == 1.0
 
 
def test_wind_and_gdd() -> None:
    # Test wind vector calculations
    assert round(float(compute_wind_speed([3.0], [4.0])[0]), 3) == 5.0
    # Test GDD calculation
    assert round(float(compute_gdd_base([15.0], 10.0)[0]), 3) == 5.0
    # Test single sine GDD function
    assert float(compute_gdd_single_sine([8.0], [20.0], 10.0)[0]) > 0.0`
    }
};

// Select dataset based on HTML lang attribute
const PROJECT_DATA = (document.documentElement.lang === "en") ? PROJECT_DATA_EN : PROJECT_DATA_ES;

// State Variables for Modal Carousel
let currentCarouselIndex = 0;
let carouselSlides = [];

// =============================================================================
// DOM EVENT HANDLERS & REGISTRATION
// =============================================================================

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. THEME INITIALIZATION AND TOGGLE
    const htmlTag = document.documentElement;
    const themeToggle = document.getElementById("theme-toggle");
    
    // Load persisted theme or default to dark
    const savedTheme = localStorage.getItem("dns-theme") || "dark";
    htmlTag.setAttribute("data-theme", savedTheme);
    
    themeToggle.addEventListener("click", () => {
        const currentTheme = htmlTag.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        htmlTag.setAttribute("data-theme", newTheme);
        localStorage.setItem("dns-theme", newTheme);
    });

    // 2. MOBILE NAVIGATION MENU
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    mobileMenuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("open");
        mobileMenuToggle.classList.toggle("active");
    });

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("open");
            mobileMenuToggle.classList.remove("active");
        });
    });

    // 3. SCROLL SPY AND NAVBAR SHADOW
    const header = document.getElementById("main-header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
        
        // Simple scroll spy to highlight nav active state
        let currentSection = "";
        const sections = document.querySelectorAll("section");
        sections.forEach(sec => {
            const top = sec.offsetTop - 120;
            if (window.scrollY >= top) {
                currentSection = sec.getAttribute("id");
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === '#' + currentSection) {
                link.classList.add("active");
            }
        });
    });

    // 4. TECHNOLOGIES CARDS FILTERING
    const filterBtns = document.querySelectorAll(".tech-filter-btn");
    const techItems = document.querySelectorAll(".tech-item");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active class from all filters
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const category = btn.getAttribute("data-category");
            
            techItems.forEach(item => {
                const itemCategory = item.getAttribute("data-category");
                if (category === "all" || itemCategory === category) {
                    item.classList.remove("hidden");
                } else {
                    item.classList.add("hidden");
                }
            });
        });
    });

    // 5. ENGINEERING PRACTICES TAB SELECTOR
    const engTabBtns = document.querySelectorAll(".eng-tab-btn");
    const engTabPanels = document.querySelectorAll(".eng-tab-panel");

    engTabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            engTabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const tabId = btn.getAttribute("data-tab");
            
            engTabPanels.forEach(panel => {
                panel.classList.remove("active");
            });
            document.getElementById(`panel-\${tabId}`).classList.add("active");
        });
    });

    // 6. TOOLS ACCORDION
    const accordionHeader = document.querySelector(".accordion-header");
    const accordionItem = document.querySelector(".accordion-item");

    if (accordionHeader) {
        accordionHeader.addEventListener("click", () => {
            accordionItem.classList.toggle("active");
        });
    }

    // 7. DETAIL MODAL LOGIC
    const modal = document.getElementById("project-modal");
    const openModalBtns = document.querySelectorAll(".open-modal-btn");
    const closeModalBtn = document.querySelector(".modal-close-btn");
    
    // Elements to update in modal
    const mMeta = document.getElementById("modal-meta");
    const mTitle = document.getElementById("modal-title");
    const mProblem = document.getElementById("modal-desc-problem");
    const mSolution = document.getElementById("modal-desc-solution");
    const mMetrics = document.getElementById("modal-desc-metrics");
    const mLessons = document.getElementById("modal-desc-lessons");
    const mCode = document.getElementById("modal-code-display");
    const mIframe = document.getElementById("modal-iframe-display");
    const mIframeBtn = document.getElementById("tab-iframe-btn");
    const mPdfLink = document.getElementById("modal-pdf-link");
    const mDashboardLink = document.getElementById("modal-dashboard-link");

    // Modal tabs control
    const mTabBtns = document.querySelectorAll(".modal-tab-btn");
    const mTabPanels = document.querySelectorAll(".modal-tab-panel");

    // Open Modal
    openModalBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const projKey = btn.getAttribute("data-project");
            const data = PROJECT_DATA[projKey];
            
            if (!data) return;
            
            // 1. Reset Modal Tab state to Overview
            mTabBtns.forEach(b => b.classList.remove("active"));
            mTabBtns[0].classList.add("active");
            mTabPanels.forEach(p => p.classList.remove("active"));
            document.getElementById("m-panel-overview").classList.add("active");
            
            // 2. Populate text content
            mMeta.textContent = data.meta;
            mTitle.textContent = data.title;
            mProblem.textContent = data.problem;
            mSolution.textContent = data.solution;
            mLessons.textContent = data.lessons;
            mCode.textContent = data.code;
            
            // Clear and populate metrics list
            mMetrics.innerHTML = "";
            data.metrics.forEach(m => {
                const li = document.createElement("li");
                li.innerHTML = m;
                mMetrics.appendChild(li);
            });
            
            // 3. Set up Action Links
            if (data.pdfLink) {
                mPdfLink.href = data.pdfLink;
                mPdfLink.style.display = "inline-flex";
            } else {
                mPdfLink.style.display = "none";
            }

            if (data.dashboardLink) {
                mDashboardLink.href = data.dashboardLink;
                mDashboardLink.style.display = "inline-flex";
            } else {
                mDashboardLink.style.display = "none";
            }
            
            // 4. Setup interactive iframe tab
            if (data.iframeSrc) {
                mIframeBtn.style.display = "block";
                mIframe.setAttribute("data-src", data.iframeSrc); // Lazy loading source
                mIframe.src = ""; // Clear active src
            } else {
                mIframeBtn.style.display = "none";
                mIframe.removeAttribute("data-src");
                mIframe.src = "";
            }
            
            // 5. Populate Carousel
            buildCarousel(data.visuals);
            
            // 6. Open Modal Overlay
            modal.classList.add("open");
            document.body.style.overflow = "hidden"; // Disable scroll behind modal
        });
    });

    // Close Modal
    const closeModal = () => {
        modal.classList.remove("open");
        document.body.style.overflow = ""; // Re-enable scroll
        mIframe.src = ""; // Clear iframe to free memory
    };

    closeModalBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    // Modal Tabs logic
    mTabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            mTabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const panelId = btn.getAttribute("data-modal-tab");
            
            mTabPanels.forEach(p => p.classList.remove("active"));
            document.getElementById('m-panel-' + panelId).classList.add("active");
            
            // Lazy load iframe on selection
            if (panelId === "iframe") {
                const pendingSrc = mIframe.getAttribute("data-src");
                if (pendingSrc && !mIframe.src) {
                    mIframe.src = pendingSrc;
                }
            }
        });
    });

    // 8. CODE COPY CLIPBOARD
    const copyBtn = document.querySelector(".copy-code-btn");
    copyBtn.addEventListener("click", () => {
        const textToCopy = mCode.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            copyBtn.textContent = "Copiado!";
            copyBtn.style.backgroundColor = "var(--accent-green)";
            setTimeout(() => {
                copyBtn.textContent = "Copiar";
                copyBtn.style.backgroundColor = "";
            }, 2000);
        });
    });

    // 9. CAROUSEL CONTROLLER
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");

    prevBtn.addEventListener("click", () => {
        navigateCarousel(currentCarouselIndex - 1);
    });

    nextBtn.addEventListener("click", () => {
        navigateCarousel(currentCarouselIndex + 1);
    });
});

// =============================================================================
// DYNAMIC CAROUSEL CONSTRUCTORS
// =============================================================================

function buildCarousel(visuals) {
    const track = document.getElementById("modal-carousel-track");
    const indicators = document.getElementById("modal-carousel-indicators");
    
    // Clear previous
    track.innerHTML = "";
    indicators.innerHTML = "";
    
    carouselSlides = visuals || [];
    currentCarouselIndex = 0;
    
    if (carouselSlides.length === 0) {
        track.innerHTML = "<div class='carousel-slide'><p class='text-muted'>No hay figuras visuales disponibles para este proyecto.</p></div>";
        document.querySelector(".prev-btn").style.display = "none";
        document.querySelector(".next-btn").style.display = "none";
        return;
    }

    // Show navigation buttons if slides > 1
    const showNav = carouselSlides.length > 1;
    document.querySelector(".prev-btn").style.display = showNav ? "flex" : "none";
    document.querySelector(".next-btn").style.display = showNav ? "flex" : "none";
    
    // Build slides
    carouselSlides.forEach((vis, idx) => {
        const slide = document.createElement("div");
        slide.className = "carousel-slide";
        
        const img = document.createElement("img");
        img.src = vis.path;
        img.alt = vis.caption;
        
        const caption = document.createElement("div");
        caption.className = "carousel-caption";
        caption.textContent = vis.caption;
        
        slide.appendChild(img);
        slide.appendChild(caption);
        track.appendChild(slide);
        
        // Build indicators if > 1
        if (showNav) {
            const dot = document.createElement("div");
            dot.className = "indicator-dot" + (idx === 0 ? " active" : "");
            dot.addEventListener("click", () => navigateCarousel(idx));
            indicators.appendChild(dot);
        }
    });

    // Reset translation
    track.style.transform = "translateX(0%)";
}

function navigateCarousel(index) {
    if (carouselSlides.length <= 1) return;
    
    const track = document.getElementById("modal-carousel-track");
    const dots = document.querySelectorAll(".indicator-dot");
    
    // Loop boundary checks
    if (index < 0) {
        index = carouselSlides.length - 1;
    } else if (index >= carouselSlides.length) {
        index = 0;
    }
    
    currentCarouselIndex = index;
    
    // Translate track
    track.style.transform = 'translateX(-' + (currentCarouselIndex * 100) + '%)';
    
    // Update dots
    dots.forEach((dot, idx) => {
        dot.classList.remove("active");
        if (idx === currentCarouselIndex) {
            dot.classList.add("active");
        }
    });
}

// Mailto form generator
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("mailto-generator-form");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("contact-name").value.trim();
            const company = document.getElementById("contact-company").value.trim();
            const type = document.getElementById("contact-type").value;
            const message = document.getElementById("contact-message").value.trim();
            
            const isEnglish = document.documentElement.lang === "en";
            const emailRecipient = "diegonunezsimms@gmail.com";
            
            let subject = "";
            let introText = "";
            
            if (isEnglish) {
                switch (type) {
                    case "cotizacion":
                        subject = `[QUOTE] Technical Consulting - ${name}`;
                        introText = `Request for quote for agricultural data science or environmental consulting.`;
                        break;
                    case "evaluacion":
                        subject = `[EVALUATION] Project Evaluation Request - ${name}`;
                        introText = `Request for evaluation of a technical project.`;
                        break;
                    case "consulta":
                        subject = `[INQUIRY] Technical Inquiry - ${name}`;
                        introText = `Technical question or inquiry regarding modeling, GIS, or climate data.`;
                        break;
                    default:
                        subject = `[CONTACT] General Message - ${name}`;
                        introText = `General professional message.`;
                        break;
                }
            } else {
                switch (type) {
                    case "cotizacion":
                        subject = `[COTIZACIÓN] Asesoría Técnica - ${name}`;
                        introText = `Solicitud de cotización para servicios de asesoría técnica agrometeorológica o ambiental.`;
                        break;
                    case "evaluacion":
                        subject = `[EVALUACIÓN] Solicitud de Evaluación de Proyecto - ${name}`;
                        introText = `Solicitud de evaluación para proyecto o trabajo técnico.`;
                        break;
                    case "consulta":
                        subject = `[CONSULTA] Consulta Técnica - ${name}`;
                        introText = `Consulta técnica o duda general sobre modelación, GIS o datos ambientales.`;
                        break;
                    default:
                        subject = `[CONTACTO] Mensaje General - ${name}`;
                        introText = `Mensaje general de contacto profesional.`;
                        break;
                }
            }
            
            let body = "";
            if (isEnglish) {
                const companyInfo = company ? `Company/Institution: ${company}\n` : "";
                body = `Hello Diego,\n\nMy name is ${name}.\n${companyInfo}Request Type: ${introText}\n\nRequest Details:\n----------------------------------------\n${message}\n----------------------------------------\n\nI look forward to hearing from you.\nBest regards,\n${name}`;
            } else {
                const companyInfo = company ? `Empresa/Institución: ${company}\n` : "";
                body = `Hola Diego,\n\nMi nombre es ${name}.\n${companyInfo}Tipo de requerimiento: ${introText}\n\nDetalle de la solicitud:\n----------------------------------------\n${message}\n----------------------------------------\n\nQuedo atento a tus comentarios.\nSaludos,\n${name}`;
            }
            
            const mailtoUrl = `mailto:${emailRecipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            window.location.href = mailtoUrl;
        });
    }
});
