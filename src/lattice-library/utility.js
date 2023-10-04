function subset(a, b){
    //Returns true if b is a Subset of a
    is_subset = true
    b.forEach(element => {if (!a.has(element)){is_subset = false}})
    return is_subset
}