## multigrid_multilevel_monte_carlo.jl : run Multigrid Multilevel Monte Carlo estimator

## main routine ##
function _run(estimator::MultiGridMultiLevelMonteCarloEstimator, ϵ::T where {T<:Real})

    # print status
    estimator.verbose && print_header(estimator,ϵ)

    # start level is 0
    level = Level(0)

    # loop variables
    converged = false

    # main loop
    while !converged

        # obtain initial variance estimate
        #N0 = estimator.nb_of_warm_up_samples
        # TODO: To determine N, I need to compute the variance ==> regress expected value 
        # TODO: NO! I think you can avooid this, but you need to regress the total variance of the estimator to compute splitting/varest
        #if !haskey(estimator.samples[1],level)
        #    N0_ = ( level > (2,) && estimator.do_regression ) ? regress(estimator,level,ϵ,θ) : N0 # regression
        #    sample!(estimator,level,N0_)
        #end
        # TODO : at least 2 samples ==> var(est, index)
        # maar! enkel bias en varest (= 1 sample) nodig ==> 1 sample
        sample!(estimator,level,1)

        # add new level to the index set
        push!(estimator,level)

        # print status
        estimator.verbose && print_status(estimator)

        # value of the MSE splitting parameter
        θ = estimator.do_splitting ? compute_splitting(estimator,ϵ) : 1/2

        while varest(estimator) > θ*ϵ^2 # doubling algorithm

            # increase the number of samples already taken
            N = length(estimator.samples[1][Level(0)])
            if estimator.sample_multiplication_factor == 2 # (round to nearest power of two)
                n_opt = nextpow2(N+1) # + 1 to increase amount
            elseif estimator.sample_multiplication_factor <= 1
                n_opt = N + 1 # add 1 sample
            else
                n_opt = ceil(Int,N*estimator.sample_multiplication_factor)
            end

            # print optimal number of samples
            estimator.verbose && print_number_of_samples(estimator,n_opt)

            # take additional samples
            r = 1/2*(β(estimator) + γ(estimator))
            r = isnan(r) ? 1.5 : r
            N = min.(floor.(Int,randexpr(r,n_opt)),level[1])
            N_sum = Int64[sum(N.==ℓ) for ℓ = 0:maximum(N)]
            N_diff = append!(-diff(N_sum),1) # subtract samples on finer levels
            for tau in keys(estimator)
                n_due = N_sum[tau[1]] - estimator.nsamples[tau]
                n_due > 0 && sample!(estimator,tau,n_due)
            end

            # recompute splitting parameter
            θ = estimator.do_splitting ? compute_splitting(estimator,ϵ) : 1/2

            # check next iteration
            estimator.verbose && print_qmc_convergence(estimator,ϵ,θ)
        end

        # show status
        estimator.verbose && print_mse_analysis(estimator,ϵ,θ)

        # check convergence
        converged = ( level >= (2,) ) && ( bias(estimator)^2 <= (1-θ)*ϵ^2 || mse(estimator) <= ϵ^2 )

        # increase level
        level = level .+ 1

        # check if the new level exceeds the maximum level
        if !converged && ( level > (estimator.max_level,) ) 
            estimator.verbose && warn_max_level(estimator)
            break
        end
    end

    # print convergence status
    estimator.verbose && print_convergence(estimator,converged)
end

# sample from exponential distribution with rate r
randexpr(r::Number,kwargs...) = randexp(kwargs...)/r

## Multilevel Monte Carlo parallel sampling ##
function parallel_sample!(estimator::MultiGridTypeEstimator,index::Index,istart::N,iend::N) where {N<:Integer}

    # parallel sampling
    wp = CachingPool(workers())
    f(i) = estimator.sample_function(index,get_point(estimator.number_generators[index],i),estimator.user_data)
    t = @elapsed all_samples = pmap(wp,f,istart:iend)

    # extract samples
    samples = last.(all_samples) # array of arrays
    dsamples = first.(all_samples)

    # append samples
    for idx in 0:index[1]
        for n_qoi in 1:estimator.nb_of_qoi
            append!(estimator.samples[n_qoi][Index(idx)],getindex.(getindex.(dsamples,idx+1),n_qoi))
            append!(estimator.samples0[n_qoi][Index(idx)],getindex.(getindex.(dsamples,idx+1),n_qoi))
        end
    end
    estimator.nsamples[index] += iend-istart+1
    estimator.total_work[index] += estimator.use_cost_model ? (iend-istart+1)*estimator.cost_model(index) : t
end

## inspector functions ##
function get_Ys(estimator::MultiGridMultiLevelMonteCarloEstimator)
    idx = point_with_max_var(estimator)
    Ys = zeros(length(samples[idx][Level(0)]))
    for index in keys(estimator)
        ns = length(samples[idx][index])
        Ys[1:ns] .+= samples[idx][index]
    end
    return Ys # these are independent
end

varest(estimator::MultiGridMultiLevelMonteCarloEstimator) = var(Ys)

moment(estimator::MultiGridMultiLevelMonteCarloEstimator) = moment(Ys,k)

# regression of optimal number of samples at unknown level
#=
function regress(estimator::MultiLevelMonteCarloEstimator,level::Level,ϵ::T,θ::T) where {T<:Real}
    p = β(estimator,both=true)
    var_est = 2^(p[1]+level[1]*p[2])
    p = γ(estimator,both=true)
    cost_est = 2^(p[1]+level[1]*p[2])
    all_sum = sum(sqrt.([var(estimator,level)*cost(estimator,level) for level in setdiff(keys(estimator),level)])) 
    all_sum += sqrt(var_est*cost_est)
    n_opt = ceil.(Int,1/(θ*ϵ^2) * sqrt(var_est/cost_est) * all_sum)
    max(2,min(n_opt,estimator.nb_of_warm_up_samples))
end
=#