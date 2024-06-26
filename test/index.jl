## index.jl : unit testing for index.jl
#
# This file is part of MultilevelEstimators.jl - A Julia toolbox for
# Multilevel Monte Carlo Methods

@testset "Level                        " begin

level_0 = Level(0)
level_2 = Level(2)
@test typeof(level_0) <: Level
@test typeof(level_2) <: Level
@test level_0 + level_2 == level_2
@test_throws MethodError Level(0.)
@test sprint(show, level_0) == "CartesianIndex(0,)"

end

@testset "Index                        " begin

index_0_0 = Index(0,0)
index_2_3 = Index(2,3)
@test typeof(index_0_0) <: Index{2}
@test typeof(index_2_3) <: Index{2}
@test index_0_0 + index_2_3 == index_2_3
@test_throws MethodError Index(0.,2)
d_index = diff(Index(1))
@test length(d_index) == 1
@test d_index[Index(0)] == -1
@test sprint(show, index_2_3) == "CartesianIndex(2, 3)"

end
