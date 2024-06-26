var documenterSearchIndex = {"docs": [

{
    "location": "index.html#",
    "page": "Home",
    "title": "Home",
    "category": "page",
    "text": ""
},

{
    "location": "index.html#MultilevelEstimators.jl-Documentation-1",
    "page": "Home",
    "title": "MultilevelEstimators.jl Documentation",
    "category": "section",
    "text": "For installation instructions, see Installation.For an example on how to use this package, see Example.A full description of the functionality is described in the Manual."
},

{
    "location": "index.html#Installation-1",
    "page": "Home",
    "title": "Installation",
    "category": "section",
    "text": "MultilevelEstimators is not added to the Julia package manager (just yet), but, the package can easily be installed by cloning the git repository. From the Julia REPL, type ] to enter Pkg mode and runpkg> add https://github.com/PieterjanRobbe/MultilevelEstimators.jlThis will install the main functionality.note: Note\nThe following packages are optional.For automatic generation of reports and figures you will need the Reporter.jl  packagepkg> add https://github.com/PieterjanRobbe/Reporter.jlFinally, to run the example problems, you can install the Multigrid solvers and the package to solve lognormal diffusion problems:pkg> add https://github.com/PieterjanRobbe/SimpleMultigrid.jl\n[...]\n\npkg> add https://github.com/PieterjanRobbe/NotSoSimpleMultigrid.jl\n[...]\n\npkg> add https://github.com/PieterjanRobbe/LognormalDiffusionProblems.jl\n[...]"
},

{
    "location": "index.html#Features-1",
    "page": "Home",
    "title": "Features",
    "category": "section",
    "text": "This package featuresImplementation of Multilevel and Multi-Index (Quasi-)Monte Carlo methods.\nNative support for parallelization on multicore machines.\nFull control of advanced algorithm options such as variance regression, mean square error splitting, ...\nAutomatic generation of reports with print-quality figures using Reporter.jl.Most recent addition to the package is unbiased Multilevel and Multi-Index Monte Carlo with automatic learning of the discrete distribution of samples across all levels or mult-indices. (See index set type U.)"
},

{
    "location": "index.html#References-1",
    "page": "Home",
    "title": "References",
    "category": "section",
    "text": "The algorithms implemented in this package are loosely based on the following papers:Basic Multilevel Monte Carlo method:\n[1] Giles, M. B. Multilevel Monte Carlo Path Simulation. Operations Research 56.3 (2008): 607-617.\n[2] Cliffe, K. A., Giles, M. B., Scheichl, R., and Teckentrup, A. L. Multilevel Monte Carlo methods and applications to elliptic PDEs with random coefficients. Computing and Visualization in Science, 14.1, (2011): 3-15.\nVariance regression and continuation:\n[3] Collier, N., Haji-Ali, A. L., Nobile, F., von Schwerin, E., and Tempone, R. A Continuation Multilevel Monte Carlo Algorithm. BIT Numerical Mathematics 55.2 (2015): 399-432. \nQuasi-Monte Carlo and Multilevel Quasi-Monte Carlo methods:\n[4] Giles, M. B., and Waterhouse, B. J. Multilevel Quasi-Monte Carlo Path Simulation. Advanced Financial Modelling, Radon Series on Computational and Applied Mathematics (2009): 165-181.\nMulti-Index (Quasi-)Monte Carlo methods:\n[5] Robbe, P., Nuyens, D., and Vandewalle, S. A Multi-Index Quasi-Monte Carlo Algorithm for Lognormal Diffusion Problems. SIAM Journal on Scientific Computing 39.5 (2017): S851-S872.\nAdaptive Multi-Index methods:\n[6] Robbe, P., Nuyens, D., and Vandewalle, S. A Dimension-Adaptive Multi-Index Monte Carlo Method Applied to a Model of a Heat Exchanger. International Conference on Monte Carlo and Quasi-Monte Carlo Methods in Scientific Computing. Springer Proceedings in Mathematics & Statistics 241 (2018): 429-445.\nUnbiased estimation:\n[7] Robbe, P., Nuyens, D. and Vandewalle, S. Recycling Samples in the Multigrid Multilevel (Quasi-)Monte Carlo Method. SIAM Journal on Scientific Computing, to appear (2019).\n[8] Robbe, P., Nuyens, D. and Vandewalle, S. Enhanced Multi-Index Monte Carlo by means of Multiple Semi-coarsened Multigrid for Anisotropic Diffusion Problems. In preparation (2019)."
},

{
    "location": "example.html#",
    "page": "Example",
    "title": "Example",
    "category": "page",
    "text": ""
},

{
    "location": "example.html#Example-1",
    "page": "Example",
    "title": "Example",
    "category": "section",
    "text": "We consider the elliptic PDE with random coefficients- nabla ( a(x omega) nabla u(x omega) ) = f(x)defined on the unit square D = 0 1^2, with homogeneous boundary conditions u(x cdot) = 0 on partial D. Assume the uncertain diffusion coefficient is given as a lognormal random field  log a(x omega) = z(x omega) where z(x omega) is a Gaussian random field (see below).note: Note\nThe following examples assume you have already installed the test dependencies as outlined in the Installation guide.Pages = [\"example.md\"]"
},

{
    "location": "example.html#Lognormal-diffusion-problems-1",
    "page": "Example",
    "title": "Lognormal diffusion problems",
    "category": "section",
    "text": "First, we need to define a random field that will be used for the uncertain diffusion coefficient of the PDE. Fortunately, a Julia package that generates and samples from such random fields already exists.using GaussianRandomFieldsTo specify the spatial correlation in the random field, we consider the Matérn covariance function with a given correlation length and smoothness. This function is predefined in the package. correlation_length = 0.5\nsmoothness = 2.0\ncovariance_function = CovarianceFunction(2, Matern(correlation_length, smoothness))We generate samples of this smooth random field using a truncated Karhunen-Loève expansion with 250 terms. To this end, we discretize the domain D into a regular grid with grid size Delta x = Delta y = 1/128.n = 256\npts = range(0, stop=1, length=n)\nn_kl = 250\ngrf = GaussianRandomField(covariance_function, KarhunenLoeve(n_kl), pts, pts)A sample of this Gaussian random field is returned by either calling the sample-function directly, or by supplying the random numbers used for sampling from the random field.sample(grf)\nsample(grf, xi = randn(n_kl))The keyword xi corresponds to the sample omega in the defintion of the PDE.We vizualize a sample of this random field.using Plots\ncontourf(sample(grf))<img src=\"assets/grf.png\" width=\"400\">Many more options and details regarding the generation of Gaussian random fields can be found in the tutorial that accomagnies the package GaussianRandomFields.jl. Suppose we are interested in computing the expected value of a quantity of interest derived from the solution of the PDE. For example, we might be interested in the value of the solution u(x ω) at the point x=y=0.5."
},

{
    "location": "example.html#Multilevel-Monte-Carlo-1",
    "page": "Example",
    "title": "Multilevel Monte Carlo",
    "category": "section",
    "text": "The basics of any multilevel method is a hierarchy of approximations of the model problem with an increasing accuracy, but corresponding increasing cost. For the lognormal diffusion example, such a hierarchy is provided by solving the PDE on an ever finer grid. We define a hierarchy of Gaussian random field generators usinggrfs = Vector{typeof(grf)}(undef, 7)\nfor i in 1:7\n    n = 2^(i+1)\n    pts = 1/n:1/n:1-1/n\n    grfs[i] = GaussianRandomField(covariance_function, KarhunenLoeve(n_kl), pts, pts)\nendThe corresponding system matrix that results from a finite difference discretization of the PDE with varying diffusion coefficient is returned by the elliptic2d-function from the SimpleMultigrid package.using SimpleMultigrid\nz = sample(grf)\na = exp.(z)\nA = elliptic2d(a)\nb = ones(size(A, 1))\nu = A\\b\ncontourf(reshape(u, n, n))"
},

{
    "location": "example.html#Creating-an-Estimator-1",
    "page": "Example",
    "title": "Creating an Estimator",
    "category": "section",
    "text": "using MultilevelEstimatorsThe main type provided by MultilevelEstimators is an Estimator. This type has two parametric subtypes, Estimator{<:AbstractIndexSet, <:AbstractSampleMethod}, where AbstractIndexSet is an abstract type for the  index set, and AbstractSampleMethod is an abstract type for the sample method. For example, a Multilevel Monte Carlo method will have type signature Estimator{ML, MC}.info: Info\nFor a complete list of possible index set types, see IndexSet. For a complete list of possible sample method types, see SampleMethod.The main user interaction required by MultilevelEstimators is the definition of a sample function. This function must return a sample of the quantity of interest, and of its difference, for the given discretization parameter (or level) and random parameters. Here is an example for the lognormal diffusion problem:function sample_lognormal(level::Level, ω::Vector{<:Real}, grf::GaussianRandomField)\n\n    # solve on finest grid\n    z  = sample(grf, xi = ω)\n    af = exp.(z)\n    Af = elliptic2d(af)\n    bf = fill(one(eltype(Af)), size(Af, 1))\n    uf = Af\\bf\n    Qf = uf[length(uf) ÷ 2]\n\n    # compute difference when not on coarsest grid\n    dQ = Qf\n    if level != Level(0)\n        ac = view(af, 2:2:size(af, 1), 2:2:size(af, 2))\n        Ac = elliptic2d(ac)\n        bc = fill(one(eltype(Af)), size(Ac, 1))\n        uc = Ac\\bc\n        Qc = uc[length(uc) ÷ 2]\n        dQ -= Qc\n    end\n    dQ, Qf\nendThus, when the level parameter is zero, we return the value of the quantity of interest on the coarsest mesh. For a larger level parameter, we return both the difference of the quantity of interest with a coarser grid solution, and the value of the quantity of interest itself.The sample function can only have two input parameters: a level and a vector of random parameters. For sample functions that require data (such as the precomputed Gaussian random fields in the example above), one might need to add a convenience function:sample_lognormal(level, ω) = sample_lognormal(level, ω, grfs[level + one(level)])Finally, for the construction of an Estimator, we also need to specify the number of random parameters and their respective distributions. For the lognormal diffusion problem, these random parameters are normally distributed.distributions = [Normal() for i in 1:n_kl]info: Info\nA complete list of predefined distributions can be found in the manual for Distributions.An estimator for the lognormal diffusion problem can thus be created usingestimator = Estimator(ML(), MC(), sample_lognormal, distributions)"
},

{
    "location": "example.html#Specifying-options-1",
    "page": "Example",
    "title": "Specifying options",
    "category": "section",
    "text": "Different options and settings can be passed on to the Estimator by supplying the appropriate keyword argument. For example, to set the number of warm up samples to 10, callestimator = Estimator(ML(), MC(), sample_lognormal, distributions, nb_of_warm_up_samples = 10)info: Info\nA complete list of optional arguments can be found in the manual for Estimator.note: Note\nIt is easy to extend the current setup to the computation of the expected value of multiple quantities of interest, by using the keyword nb_of_qoi."
},

{
    "location": "example.html#Running-a-simulation-1",
    "page": "Example",
    "title": "Running a simulation",
    "category": "section",
    "text": "To start a simulation for the expected value of the quantity of interest up to an absolute (root mean square) error of 5e-3, callh = run(estimator, 5e-3)This function will return a History object that contains usefull diagnostics about the simulation.info: Info\nSee History for a complete list of diagnostic entries.note: Note\nBy default, the simulation is performed for a sequence of larger tolerances to get improved estimates for the rates of decay of expected value and variance, bias estimation... This sequence is of the formtexttol_i = p^(n - 1 - i) texttol i = 0 ldots n - 1with p1 and where the values for p and n can be controlled by the keyword arguments continuation_mul_factor and nb_of_tols respectively. You can disable continuation with the optional argument continuation = false. Our experience is that continuation is a very powerful tool when combined with a non-trivial mean square error splitting (do_mse_splitting = true) and variance regression (do_regression = true). note: Note\nBy default, samples will be taken in parallel on all available processors (see addprocs). The number of processors is controlled by the optional keyword nb_of_workers. This can either be a fixed value, or a function, specifying the number of workers to be used on each level."
},

{
    "location": "example.html#Vizualization-of-the-result-using-[Reporter](https://github.com/PieterjanRobbe/Reporter.jl)-1",
    "page": "Example",
    "title": "Vizualization of the result using Reporter",
    "category": "section",
    "text": "MultilevelEstimators can automatically build a set of diagnostic figures based on a History file. Load the package byusing Reporterand generate a report by callingreport(h)If all goes well, you should now see a webpage with diagnostic information about the simulation, similar to this one. Print-ready .tex-figures are stored locally under figures/."
},

{
    "location": "example.html#Multilevel-Quasi-Monte-Carlo-1",
    "page": "Example",
    "title": "Multilevel Quasi-Monte Carlo",
    "category": "section",
    "text": "Quasi-Monte Carlo is an alternative way to pick the samples omega. The random samples in the Monte Carlo method are replaced by deterministically well-chosen points that increase the accuracy of the estimation with respect to the number of samples. A popular type of such point sets are rank-1 lattice rules, implemented here as LatticeRule32. These points are used by default when calling the QMC-version of the Estimatorestimator = Estimator(ML(), QMC(), sample_lognormal, distributions)Under the hood, the default lattice rule uses a 3600-dimensional generating vector from Kuo et al. It is easy to provide your own generating vector with the optional point_generator-argument.estimator = Estimator(ML(), QMC(), sample_lognormal, point_generator = LatticeRule32(\"my_gen_vec.txt\"))note: Note\nThe number of shifts is controlled by the nb_of_shifts-keyword. We recommend a value between 10 (default) and 30. The number of samples is updated carefully, with a default multiplication factor of 1.2 (instead of the standard and theoretically justifiable value 2, which we found to be too aggressive). This number can be controlled with the keyword sample_mul_factor. "
},

{
    "location": "example.html#Multi-Index-Monte-Carlo-1",
    "page": "Example",
    "title": "Multi-Index Monte Carlo",
    "category": "section",
    "text": "It is easy to extend the lognormal diffusion example to compute multi-index differences. Instead of a difference between a fine and a coarse approximation, we now compute mixed differences.function sample_lognormal(index::Index, ω::Vector{<:Real}, grf::GaussianRandomField)\n\n    # solve on finest grid\n    z  = sample(grf, xi = ω)\n    af = exp.(z)\n    Af = elliptic2d(af)\n    bf = fill(eltype(Af), size(Af, 1))\n    uf = Af\\bf\n    Qf = uf[length(uf) ÷ 2]\n\n    # compute multi-index differences\n    dQ = Qf\n    for (key, val) in diff(index)\n        step = (index - key).I .+ 1\n        ac = view(af, step[1]:step[1]:size(af, 1), step[2]:step[2]:size(af, 2))\n        Ac = elliptic2d(ac)\n        bc = fill(eltype(Af), size(Ac, 1))\n        uc = Ac\\bc\n        Qc = uc[length(uc) ÷ 2]\n        dQ += val * Qc\n    end\n    dQ, Qf\nendAll functionality is hidden in the call to diff(index). This function returns a Dict with as keys the indices where coarse approximations must be computed, and as values +1 or -1, specifying how these corrections must be added to the quantity of interest on the fine grid."
},

{
    "location": "example.html#Multi-index-sets-1",
    "page": "Example",
    "title": "Multi-index sets",
    "category": "section",
    "text": "Different choices for the multi-index sets are available: full tensor index sets (FT), total degree index sets (TD), hyperbolic cross index sets (HC) and Zaremba cross index sets (ZC). For example, total degree (TD) index sets look like this using MultilevelEstimators # hide\nindex_set = TD(2)\nfor sz = 0:5\n    println(\"size parameter: \", sz)\n    print(index_set, sz)\nendWeighted index sets are created by specifying appropriate weiths. All weights must be smaller than or equal to 1.using MultilevelEstimators # hide\nindex_set = ZC(1/2, 1)\nfor sz = 0:5\n    println(\"size parameter: \", sz)\n    print(index_set, sz)\nendWe can create an estimator the usual way:estimator = Estimator(TD(2), MC(), sample_lognormal, distributions)where TD(2) denotes a 2-dimensional index set.Before running a simulation, we must precomputed the random fields on all indices.grfs = Matrix{typeof(grf)}(undef, 7, 7)\nfor index in get_index_set(TD(2), 6)\n    n = 2 .^(index.I .+ 2)\n    pts = map(i -> range(1/i, step = 1/i, stop = 1 - 1/i), n)\n    grfs[index + one(index)] = GaussianRandomField(covariance_function, KarhunenLoeve(n_kl), pts...)\nendA multi-index Monte Carlo simulation with this estimator is performed byh = run(estimator, 5e-3)"
},

{
    "location": "example.html#Adaptive-Multi-index-Monte-Carlo-1",
    "page": "Example",
    "title": "Adaptive Multi-index Monte Carlo",
    "category": "section",
    "text": "Instead of using predefined (weighted or unweighted) index sets, we can also construct the index set adaptively based on some profit indicator (see [6])P_ell = fracE_ellsqrtV_ell W_ellwhere E_ell and V_ell are the expected value and variance of the multi-index difference, respectively, and W_ell is the computational cost required to computed a sample of the difference.estimator = Estimator(AD(2), MC(), sample_lognormal, distributions)note: Note\nThe maximum allowed indices that can be simulated can be set by the keyword max_search_space. This keyword should be an index set of one of the above types. The adaptive method will only find indices inside this index set, with the size parameter equal to max_index_set_param.note: Note\nSometimes it is beneficial to add a penalization parameter to the profit indicator to avoid searching too much around the coordinate axes, and bumping into a memory constraint:  P_ell = fracE_ell(sqrtV_ell W_ell)^pwith 0 < p < 1. Specify p with the optional key penalization. "
},

{
    "location": "example.html#Multi-Index-Quasi-Monte-Carlo-1",
    "page": "Example",
    "title": "Multi-Index Quasi Monte Carlo",
    "category": "section",
    "text": "Just as in standard Multilevel Monte Carlo, the Multi-Index Monte Carlo method can be extended to use quasi-random numbers instead, see [5]. The setup remains the same, just change MC() into QMC(). For example, a Hyperbolic Cross Multi-Index Quasi-Monte Carlo estimator can be created by estimator = Estimator(HC(2), QMC(), sample_lognormal, distributions)"
},

{
    "location": "example.html#Unbiased-estimation-1",
    "page": "Example",
    "title": "Unbiased estimation",
    "category": "section",
    "text": "The most recent development to MultilevelEstimators is the addition of unbaised multilevel estimators. In contrast to standard Multilevel Monte Carlo, a weighted sum of multilevel contributions is used, thus eliminating the bias in the estimator.This requires a small change to the sample function, in the sense that it should now return the solutions for all levels smaller than or equal to level. In the PDE example this can easily be accomplished by using Full Multigrid, see [7] and [8]. See SimpleMultigrid and NotSoSimpleMultigrid for basic example solvers. See also LognormalDiffusionProblems for a setup using Full Multigrid.estimator = estimator(U(1), MC(), sample_lognormal_fmg, distributions)warning: Warning\nSince this is a recent addition to MultilevelEstimators, it has not been tested as extensively as the other methods. Should you encounter any issues, feel free to submit an issue.info: Info\nSee the index set type U for more information and set up."
},

{
    "location": "manual.html#",
    "page": "Manual",
    "title": "Manual",
    "category": "page",
    "text": ""
},

{
    "location": "manual.html#Manual-1",
    "page": "Manual",
    "title": "Manual",
    "category": "section",
    "text": "Pages = [\"manual.md\"]"
},

{
    "location": "manual.html#MultilevelEstimators.Level",
    "page": "Manual",
    "title": "MultilevelEstimators.Level",
    "category": "type",
    "text": "Level(l::Integer)\n\nReturn a level.\n\nExamples\n\njulia> level = Level(2)\n2\n\nSee also: Index\n\n\n\n\n\n"
},

{
    "location": "manual.html#MultilevelEstimators.Index",
    "page": "Manual",
    "title": "MultilevelEstimators.Index",
    "category": "type",
    "text": "Index(i::Integer...)\n\nReturn a multi-index.\n\nExamples\n\njulia> index = Index(2, 1)\n(2, 1)\n\nSee also: Level\n\n\n\n\n\n"
},

{
    "location": "manual.html#Index-1",
    "page": "Manual",
    "title": "Index",
    "category": "section",
    "text": "Level\nIndex"
},

{
    "location": "manual.html#MultilevelEstimators.SL",
    "page": "Manual",
    "title": "MultilevelEstimators.SL",
    "category": "type",
    "text": "SL()\n\nReturn a single-level index set.\n\nExamples\n\njulia> SL()\nSL\n\nSee also: ML, FT, TD, HC, ZC, AD, U\n\n\n\n\n\n"
},

{
    "location": "manual.html#MultilevelEstimators.ML",
    "page": "Manual",
    "title": "MultilevelEstimators.ML",
    "category": "type",
    "text": "ML()\n\nReturn a multi-level index set.\n\nExamples\n\njulia> ML()\nML\n\nSee also: SL, FT, TD, HC, ZC, AD, U\n\n\n\n\n\n"
},

{
    "location": "manual.html#MultilevelEstimators.FT",
    "page": "Manual",
    "title": "MultilevelEstimators.FT",
    "category": "type",
    "text": "FT(d::Integer)\nFT(δ::Real...)\nFT(δ::AbstractVector{<:Real})\nFT(δ::NTuple{N, <:Real})\n\nReturn a full tensor index set in d dimenions with optional weights δ. Default weights are all 1\'s.\n\nExamples\n\njulia> FT(2)\nFT{2}\n\njulia> FT([1, 1/2, 1/2])\nFT{3}\n\njulia> print(FT(2), 4)\n  ◼ ◼ ◼ ◼ ◼\n  ◼ ◼ ◼ ◼ ◼\n  ◼ ◼ ◼ ◼ ◼\n  ◼ ◼ ◼ ◼ ◼\n  ◼ ◼ ◼ ◼ ◼\n\nSee also: SL, ML, TD, HC, ZC, AD, U\n\n\n\n\n\n"
},

{
    "location": "manual.html#MultilevelEstimators.TD",
    "page": "Manual",
    "title": "MultilevelEstimators.TD",
    "category": "type",
    "text": "TD(d::Integer)\nTD(δ::Real...)\nTD(δ::AbstractVector{<:Real})\nTD(δ::NTuple{N, <:Real})\n\nReturn a total degree index set in d dimenions with optional weights δ. Default weights are all 1\'s.\n\nExamples\n\njulia> TD(2)\nTD{2}\n\njulia> TD([1, 1/2, 1/2])\nTD{3}\n\njulia> print(TD(2), 4)\n  ◼\n  ◼ ◼\n  ◼ ◼ ◼\n  ◼ ◼ ◼ ◼\n  ◼ ◼ ◼ ◼ ◼\n\nSee also: SL, ML, FT, HC, ZC, AD, U\n\n\n\n\n\n"
},

{
    "location": "manual.html#MultilevelEstimators.HC",
    "page": "Manual",
    "title": "MultilevelEstimators.HC",
    "category": "type",
    "text": "HC(d::Integer)\nHC(δ::Real...)\nHC(δ::AbstractVector{<:Real})\nHC(δ::NTuple{N, <:Real})\n\nReturn a hyperbolic cross index set in d dimenions with optional weights δ. Default weights are all 1\'s.\n\nExamples\n\njulia> HC(2)\nHC{2}\n\njulia> HC([1, 1/2, 1/2])\nHC{3}\n\njulia> print(HC(2), 4)\n  ◼\n  ◼\n  ◼\n  ◼ ◼\n  ◼ ◼ ◼ ◼ ◼\n\nSee also: SL, ML, FT, TD, ZC, AD, U\n\n\n\n\n\n"
},

{
    "location": "manual.html#MultilevelEstimators.ZC",
    "page": "Manual",
    "title": "MultilevelEstimators.ZC",
    "category": "type",
    "text": "ZC(d::Integer)\nZC(δ::Real...)\nZC(δ::AbstractVector{<:Real})\nZC(δ::NTuple{N, <:Real})\n\nReturn a Zaremba cross index set in d dimenions with optional weights δ. Default weights are all 1\'s.\n\nExamples\n\njulia> ZC(2)\nZC{2}\n\njulia> ZC([1, 1/2, 1/2])\nZC{3}\n\njulia> print(ZC(2), 4)\n  ◼ ◼ \n  ◼ ◼ \n  ◼ ◼ ◼ \n  ◼ ◼ ◼ ◼ ◼ \n  ◼ ◼ ◼ ◼ ◼ \n\nSee also: SL, ML, FT, TD, HC, AD, U\n\n\n\n\n\n"
},

{
    "location": "manual.html#MultilevelEstimators.AD",
    "page": "Manual",
    "title": "MultilevelEstimators.AD",
    "category": "type",
    "text": "AD(d::Integer)\n\nReturn an adaptive index set in d dimenions.\n\nExamples\n\njulia> AD(2)\nAD{2}\n\nSee also: SL, ML, FT, TD, HC, ZC, U\n\n\n\n\n\n"
},

{
    "location": "manual.html#MultilevelEstimators.U",
    "page": "Manual",
    "title": "MultilevelEstimators.U",
    "category": "type",
    "text": "U(d::Integer)\n\nReturn an unbiased  multi-level or multi-index index set in d dimensions.\n\nExamples\n\njulia> U(2)\nU{2}\n\nSee also: SL, ML, FT, TD, HC, ZC, AD\n\n\n\n\n\n"
},

{
    "location": "manual.html#MultilevelEstimators.get_index_set",
    "page": "Manual",
    "title": "MultilevelEstimators.get_index_set",
    "category": "function",
    "text": "get_index_set(idxset::AbstractIndexSet, sz::Integer)\n\nReturn an iterator over all indices in the index set idxset for a given size parameter sz.\n\nExamples\n\njulia> collect(get_index_set(TD(2), 2))\n6-element Array{CartesianIndex{2},1}:\n (0, 0)\n (1, 0)\n (2, 0)\n (0, 1)\n (1, 1)\n (0, 2)\n\n\n\n\n\n"
},

{
    "location": "manual.html#Base.print",
    "page": "Manual",
    "title": "Base.print",
    "category": "function",
    "text": "print(idxset::AbstractIndexSet{2}, sz::Integer)\n\nPrint the indices in the index set idxset for a given size parameter sz. Only implemented for two-dimensional index sets.\n\nExamples\n\njulia> print(TD(2), 3)\n  ◼\n  ◼ ◼\n  ◼ ◼ ◼\n  ◼ ◼ ◼ ◼\n\n\n\n\n\n"
},

{
    "location": "manual.html#IndexSet-1",
    "page": "Manual",
    "title": "IndexSet",
    "category": "section",
    "text": "SL\nML\nFT\nTD\nHC\nZC\nAD\nU\nget_index_set\nprint"
},

{
    "location": "manual.html#MultilevelEstimators.MC",
    "page": "Manual",
    "title": "MultilevelEstimators.MC",
    "category": "type",
    "text": "MC()\n\nReturn a Monte Carlo sample method.\n\nSee also: QMC\n\n\n\n\n\n"
},

{
    "location": "manual.html#MultilevelEstimators.QMC",
    "page": "Manual",
    "title": "MultilevelEstimators.QMC",
    "category": "type",
    "text": "QMC()\n\nReturn a Quasi-Monte Carlo sample method.\n\nSee also: MC\n\n\n\n\n\n"
},

{
    "location": "manual.html#SampleMethod-1",
    "page": "Manual",
    "title": "SampleMethod",
    "category": "section",
    "text": "MC\nQMC"
},

{
    "location": "manual.html#MultilevelEstimators.Uniform",
    "page": "Manual",
    "title": "MultilevelEstimators.Uniform",
    "category": "type",
    "text": "Uniform([a = 0, [b = 1]])\n\nReturn a uniform distribution on [a, b].\n\nExamples\n\njulia> Uniform()\nUniform{Int64}(a = 0, b = 1)\n\nSee also: Normal, TruncatedNormal, Weibull\n\n\n\n\n\n"
},

{
    "location": "manual.html#MultilevelEstimators.Normal",
    "page": "Manual",
    "title": "MultilevelEstimators.Normal",
    "category": "type",
    "text": "Normal([μ = 0, [σ = 1]])\n\nReturn a normal distribution with mean μ and standard deviation σ.\n\nExamples\n\njulia> Normal()\nNormal{Int64}(μ = 0, σ = 1)\n\nSee also: Uniform, TruncatedNormal, Weibull\n\n\n\n\n\n"
},

{
    "location": "manual.html#MultilevelEstimators.TruncatedNormal",
    "page": "Manual",
    "title": "MultilevelEstimators.TruncatedNormal",
    "category": "type",
    "text": "TruncatedNormal([μ = 0, [σ = 1, [a = -2, [b = 2]]]])\n\nReturn a truncated normal distribution with mean μ and standard deviation σ.\n\nExamples\n\njulia> TruncatedNormal()\nTruncatedNormal{Int64}(μ = 0, σ = 1, a = -2, b = 2)\n\nSee also: Uniform, Normal, Weibull\n\n\n\n\n\n"
},

{
    "location": "manual.html#MultilevelEstimators.Weibull",
    "page": "Manual",
    "title": "MultilevelEstimators.Weibull",
    "category": "type",
    "text": "Weibull([k = 2, [λ = √2]])\n\nReturn a Weibull distribution with shape parameter k and scale parameter λ.\n\nExamples\n\njulia> Weibull()\nWeibull{Float64}(k = 2.0, λ = 1.4142135623730951)\n\nSee also: Uniform, Normal, TruncatedNormal\n\n\n\n\n\n"
},

{
    "location": "manual.html#MultilevelEstimators.transform",
    "page": "Manual",
    "title": "MultilevelEstimators.transform",
    "category": "function",
    "text": "transform(D::AbstractDistribution, x::Real)\n\nApply a transformation to the uniformly distributed number x such that it is distributed according to D.\n\nThe transform is implemented by applying the inverse CDF of the distribution D.\n\nnote: Note\nThis is currently limited only to distributions with an analytic expression for the inverse CDF.\n\nExamples\n\njulia> x = rand(10)\n10-element Array{Float64,1}:\n 0.23603334566204692\n 0.34651701419196046\n 0.3127069683360675\n 0.00790928339056074\n 0.4886128300795012\n 0.21096820215853596\n 0.951916339835734\n 0.9999046588986136\n 0.25166218303197185\n 0.9866663668987996\n\njulia> broadcast(i -> transform(Normal(), i), x)\n10-element Array{Float64,1}:\n -0.7191204773101185 \n -0.39474101736576256\n -0.4881918784059056 \n -2.413074939355834  \n -0.02854727903738184\n -0.8030663180302484 \n  1.6637253880181684 \n  3.7310515426407296 \n -0.6692682660790877 \n  2.2163540181904553 \n\n\n\n\n\n"
},

{
    "location": "manual.html#Distribution-1",
    "page": "Manual",
    "title": "Distribution",
    "category": "section",
    "text": "Uniform\nNormal\nTruncatedNormal\nWeibull\ntransform"
},

{
    "location": "manual.html#MultilevelEstimators.LatticeRule32",
    "page": "Manual",
    "title": "MultilevelEstimators.LatticeRule32",
    "category": "type",
    "text": "LatticeRule32(z, s, n)\nLatticeRule32(z, s)\nLatticeRule32(z)\n\nReturns a rank-1 lattice rule in s dimensions with generating vector z and at most n points.\n\nWhen no maximum number of points n is provided, we assume n=2^32. When no number of dimensions s is provided, we assume s=length(z). \n\ninfo: Info\nTechnically, we return an extensible lattice sequence where the k-th point is transformed using the radical inverse function. This has the advantage that we can add points to the set without changing the already computed points.\n\nMore generating vectors can be found online here or here.\n\nExamples\n\njulia> lattice_rule = LatticeRule32([0x00000001,0x00000022], 2, 0x00000037) # Fibonacci lattice rule\nLatticeRule32{2}\n\njulia> get_point(lattice_rule, 2)\n2-element Array{Float64,1}:\n 0.75\n 0.5\n\njulia> get_point(lattice_rule, 56) # returns random points beyond n\n2-element Array{Float64,1}:\n 0.23603334566204692\n 0.34651701419196046\n\nSee also: get_point, ShiftedLatticeRule\n\n\n\n\n\nLatticeRule32(str, s, n)\nLatticeRule32(str, s)\nLatticeRule32(str)\n\nReturns a rank-1 lattice rule in s dimensions with generating vector z read from the file str and at most n points.\n\nExamples\n\njulia> z_file = joinpath(dirname(pathof(MultilevelEstimators)), \"generating_vectors\", \"K_3600_32.txt\");\n\njulia> lattice_rule = LatticeRule32(z_file, 16)\nLatticeRule32{16}\n\njulia> get_point(lattice_rule, 123)\n16-element Array{Float64,1}:\n 0.3828125\n 0.2890625\n 0.1484375\n 0.3515625\n 0.6015625\n 0.1171875\n 0.4296875\n 0.4609375\n 0.2265625\n 0.6484375\n 0.9609375\n 0.6796875\n 0.0546875\n 0.2265625\n 0.1328125\n 0.1640625\n\n\nSee also: get_point, ShiftedLatticeRule\n\n\n\n\n\n"
},

{
    "location": "manual.html#MultilevelEstimators.ShiftedLatticeRule",
    "page": "Manual",
    "title": "MultilevelEstimators.ShiftedLatticeRule",
    "category": "type",
    "text": "ShiftedLatticeRule(lat::AbstractLatticeRule)\n\nReturns a shifted rank-1 lattice rule based on the lattice rule lat.\n\nExamples\n\njulia> z_file = joinpath(dirname(pathof(MultilevelEstimators)), \"generating_vectors\", \"K_3600_32.txt\");\n\njulia> lattice_rule = LatticeRule32(z_file, 16)\nLatticeRule32{16}\n\njulia> shifted_lattice_rule = ShiftedLatticeRule(lattice_rule)\nShiftedLatticeRule{LatticeRule32{16}}\n\njulia> get_point(shifted_lattice_rule, 0)\n16-element Array{Float64,1}:\n 0.23603334566204692\n 0.34651701419196046\n 0.3127069683360675\n 0.00790928339056074\n 0.4886128300795012\n 0.21096820215853596\n 0.951916339835734\n 0.9999046588986136\n 0.25166218303197185\n 0.9866663668987996\n 0.5557510873245723\n 0.43710797460962514\n 0.42471785049513144\n 0.773223048457377\n 0.2811902322857298\n 0.20947237319807077\n\n\nSee also: LatticeRule32, get_point\n\n\n\n\n\n"
},

{
    "location": "manual.html#MultilevelEstimators.get_point",
    "page": "Manual",
    "title": "MultilevelEstimators.get_point",
    "category": "function",
    "text": "get_point(lat::AbstractLatticeRule, k::Integer)\n\nGet the k-th point of the lattice rule lat.\n\njulia> lattice_rule = LatticeRule32([0x00000001,0x00000022], 2, 0x00000037) # Fibonacci lattice rule\nLatticeRule32{2}\n\njulia> get_point(lattice_rule, 2)\n2-element Array{Float64,1}:\n 0.75\n 0.5\n\n\nSee also: LatticeRule32, ShiftedLatticeRule\n\n\n\n\n\n"
},

{
    "location": "manual.html#LatticeRule32-1",
    "page": "Manual",
    "title": "LatticeRule32",
    "category": "section",
    "text": "LatticeRule32\nShiftedLatticeRule\nget_point"
},

{
    "location": "manual.html#MultilevelEstimators.Estimator",
    "page": "Manual",
    "title": "MultilevelEstimators.Estimator",
    "category": "type",
    "text": "Estimator(index_set::AbstractIndexSet,\n          sample_method::AbstractSampleMethod,\n          sample_function::Function,\n          distributions::Vector{<:Distribution}; kwargs...)\n\nCreate an Estimator with index set index_set and sample method sample_method to compute the expected value of the quantity of interest returned by sample_function, and where distributions is the uncertainty on the input parameters.\n\nExamples\n\nSee the example section in the online documentation for examples on how to use this function.\n\nGeneral keywords\n\nDifferent algorithmic options can be set by providing appropriate keyword arguments. A list of these keyword arguments and their description is provided below.\n\nnote: Note\nNot all keyword arguments can be used in combination with all Estimator types.\n\nname – a human readable name for the problem that must be solved. This name will be used when saving a History file with diagnostic information from each run, and also when generating reports with the Reporter-package. Default is UntitledEstimator.\n\nfolder is where the History files with diagnostic information from every run will be saved. Default is the current directory.\n\nsave – if set to true, MultilevelEstimators saves diagnostic information about the simulation in a separate file in the .jld2 format. See JLD2 for more information about this file format. By default, this keyword is set to true.\n\nverbose – if set to true, MultilevelEstimators will print useful information about the run to STDOUT. Default is true.\n\nnb_of_warm_up_samples is the number of warm-up samples to take at each level (or index) to obtain initial variance estimates. In combination with do_regression = true (default), this is only true for all levels < 2 (or indices with all coordinate directions < 2). On all other levels (or indices), this is the initial maximum number of regressed samples. When using MC-sampling, this value must be larger than or equal to 2, in order to be able to compute the variance. The default value is 20. When using QMC-sampling, this is the number of samples per random shift, and since we only consider the variance with repect to all random shifts, this value can be as small as 1 (default). Increase this number for more accurate initial variance estimation.   \n\nnb_of_qoi is the number of quantities of interest returned by the sample_function. In this case, the simulation will be performed by controlling the root mean square error of the quantity of interest with the largest variance. The expected value of all other quantities of interest is guaranteed to be estimated more accurate or as accurate as the one with the largest variance. The default value is 1.\n\ncontinuate – if set to true, each call to run with a specified tolerance tol results in a simulation for a sequence of larger tolerances texttol_i = p^(n-1-i) texttol to get improved estimates for the variance and the bias. The default value is true.\n\ncontinuation_mul_factor is the value p in the above formula. The default value is 1.2.\n\nnb_of_tols is the value n in the above formula. The default value is 10.\n\nsave_samples – if set to true, all samples of a run will be saved together with the diagnostic information. This is usefull for plotting histograms etc.\n\ncost_model allows the user to provide a function that returns the cost of a sample on each index. For example, a geometric cost model could be provided with\n\nγ = 1.5\nEstimator(...; cost_model = level -> 2^(γ * level[1]))\n\nWhen no cost model is provided (default), the actual run time on each level (or index) is used as a proxy for the cost model.\n\ntip: Tip\nBeware of precompilation! Using actual run times for the cost model might be very unreliable, especially on the coarsest level (or index), when the Estimator is run for the first time. In real production code, it is advised that the run-function is called once beforehand with a larger tolerance than the target accuracuy, to eliminate precompilation time.run(estimator, 10 * tol) # precompilation run\nrun(estimator, tol)\n\nnb_of_workers allows the user to specify the number of workers (processors) to be used for parallel sampling in a multicore environment. By default, this is equal to the value returned by nworkers(). nb_of_workers can also be given as function, specifying the number of workers on each level (or index). This is particularly usefull for expensive sample functions that require non-trivial load balancing.\n\nnb_of_uncertainties is a function indicating the number of uncertainties to be used on each level (or each index). The default value is equal to the length of distributions, the vector of Distributions specifying the input uncertainty of the parameters. This is useful for so-called level-dependent estimators, where a different number of parameters is activated on each level (or index). The length of distributions must be larger than or equal to the maximum value returned by this function.\n\nmax_index_set_param is the maximum index set size parameter that can be used in a simulation. Typically, a simulation will only be possible up to a finite index set size parameter, due to, for instance, memory constraints or prohibitively lare computational cost. For a multilevel simulation with ML this is the maximum number of levels. For a multi-index simulation with FT, TD, HC or ZC, this is the maximum index set size parameter. For simulations with AD or U, this is the maximum index set size to be used in the max_search_space (see below). Default is 9223372036854775807 (typemax(Int64)). When this value is exceeded, the simulation will stop with a bias (and, consequently, a root mean square error) larger than the requested accuracy.\n\nKeywords valid for index set types SL, ML, FT, TD, HC and ZC\n\ndo_regression – if set to true, the variance on the finer levels (or indices) will be guessed from the aready available variances on the coarser levels (or indices). These finer levels (or indices) must have a value larger than or equal to 2 in at least one of the coordinate directions. This is very powerfull when dealing with computationally demanding sample functions. Default: true.\n\ndo_mse_splitting – if set to true, MultilevelEstimators will use a non-trivial splitting of the mean square error of the estimator: textMSE = theta textvar + (1 - theta) textbias^2. The value of the splitting parameter is very important to obtain an efficient estimator. Default is true.  \n\nmin_splitting is the minimum value for the mean square error splitting parameter. Default: 0.5.\n\nmax_splitting is the maximum value for the mean square error splitting parameter. Default: 0.99.\n\nKeywords valid for index set types AD and U\n\nmax_search_space determines, together with max_index_set_param, the collection of all indices that may be considered for further refinement. This is necessary for AD- and U-type index sets, that do not define such a set, by defintion. Default: TD.  \n\nKeywords valid for AD index sets\n\npenalization is a factor added to the computation of the profit indicators in the adaptive algorithm. We observed that in some cases, the algorithm stretches its search space too much around the coordinate axes, especially when actual computation times are used (see cost_model). The penalization parameter 0<p<1 penalizes these search directions, in favor of more classically-shaped index sets, such as TD.\n\nP_ell = fracE_ell(sqrtV_ell W_ell)^p\n\nKeywords valid for QMC sample methods\n\nnb_of_shifts indicates the number of randomly-shifted rank-1 lattice rules used in the QMC method. The higher this value, the more accurate the variance estimation will be. This keyword can also be a function that returns the number of shifts on each level (or index). Typically, the number of shifts on coarser levels will be smaller than the number of shifts on finer levels, since, on these coarse levels, many QMC samples will be available. Default is 10 random shifts.\n\nnote: Note\nWe recommend a value for nb_of_shifts between 10 and 30.\n\nsample_mul_factor is the multplication factor in the QMC \"doubling algorithm\". Typically, and as can be justified theoretically, this value is equal to 2. We find that it is sometimes more beneficial to use a smaller multiplication factor, since direclty doubling the number of samples is a quite dramatic event. Default: 1.2.\n\npoint_generator is a keyword that allows the user to specify a custom QMC point set of type AbstractLatticeRule. Default is a 3600-dimensional lattice rule from this website. \n\nSee also: run, History\n\n\n\n\n\n"
},

{
    "location": "manual.html#Base.run",
    "page": "Manual",
    "title": "Base.run",
    "category": "function",
    "text": "run(estimator::Estimator, ε::Real)\nrun(estimator::Estimator, ε::Vector{<:Real})\n\nRun the estimator and compute the expected value of the quantity of interest up to the given tolerance(s) ε. Returns a History-object that contains usefull diagnostics about the simulation. \n\nExamples\n\nAn example detailing how to use MultilevelEstimators is provided in the example in the documentation.\n\nSee also: Estimator, History\n\n\n\n\n\n"
},

{
    "location": "manual.html#Estimator-1",
    "page": "Manual",
    "title": "Estimator",
    "category": "section",
    "text": "Estimator\nrun"
},

{
    "location": "manual.html#MultilevelEstimators.History",
    "page": "Manual",
    "title": "MultilevelEstimators.History",
    "category": "type",
    "text": "History\n\nA History is the result of a call to run and contains useful diagnostic information about the state of the Estimator.\n\nThe information is stored as a Vector of Dict\'s, where each entry in the vector is the result of a single run. See below for a list of keys added to these Dicts. Access to the key corresponding to the last entry in the History (that is, the one with the highest accuracy) is provided as history[key].\n\nSee also the package Reporter for automatic generation of reports based on a History object.\n\nKeys\n\ntype::AbstractIndexSet: the index set type of the Estimator.\nndims::Integer: the number of dimensions of the Estimator.\nname::String: the name of this Estimator.\nfolder::String: the directory where the results are stored.\nelapsed::Real: the elapsed time (in seconds).\ntol::Real: the request accuracy.\ncurrent_index_set::Vector{::Index}: the levels (or indices) currently in use by the Estimator.\nindex_set::Vector{::Index}: all levels (or indices) that are added to the Estimator.\nmse::Real: the measured mean square error of the Estimator. \nrmse::Real: the measured root mean square error of the Estimator. \nmean::Real: the estimated expected value of the quantity of interest, up to an absolute error of tol.\nvar::Real: the measured variance of the quantity of interest.\nvarest::Real: the measured variance of the Estimator for the expected value of the quantity of interest.\nbias::Real: the measured bias of the Estimator.\nE::Dict{::Index, ::Real}: a Dict with the measured expected value of the quantity of interest on each level (or index).\nV::Dict{::Index, ::Real}: a Dict with the measured variance of the quantity of interest on each level (or index).\ndE::Dict{::Index, ::Real}: a Dict with the measured expected value of the difference of the quantity of interest on each level (or index).\ndV::Dict{::Index, ::Real}: a Dict with the measured variance of the difference of the quantity of interest on each level (or index).\nT::Dict{::Index, ::Real}: a Dict with the measured computation time for a sample of the quantity of interest on each level (or index).\nW::Dict{::Index, ::Real}: a Dict with the computational cost for a sample of the quantity of interest on each level (or index). Only available when a cost model was provided!\nα::Tuple: the estimated rates of decay of the expected value of the difference of the quantity of interest.\nβ::Tuple: the estimated rates of decay of the variance of the difference of the quantity of interest.\nγ::Tuple: the estimated rates of increase of the cost of the difference of the quantity of interest.\nnb_of_samples::Array: an Array with, on each index, the number of samples taken on that index. \nlogbook: a logbook with information about the adaptive algorithm Only available for Estimators with index sets of type AD\nsamples::Array: an Array with on each index, the collection of samples of the quantity of interest taken on that index. Only available when the optional key save_samples = true was used \nsamples_diff::Array: an Array with on each index, the collection of samples of the difference of the quantity of interest taken on that index. Only available when the optional key save_samples = true was used \n\nSee also: Estimator, run\n\n\n\n\n\n"
},

{
    "location": "manual.html#History-1",
    "page": "Manual",
    "title": "History",
    "category": "section",
    "text": "History"
},

]}
