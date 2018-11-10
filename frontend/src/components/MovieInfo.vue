<template>
    <div>
        <h1>{{ movie.MovieTitle }}</h1>
    </div>
</template>

<script>
    export default {
        created: function() {
            var id = this.$route.params.id;
            this.$http.get(`/api/movies/${id}`).
            then((res) => {
                this.movie = res.data
            })
        },
        data: function() {
            return {
                movie: {}
            }
        }
    }
</script>