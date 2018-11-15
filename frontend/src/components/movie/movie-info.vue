<template>
    <div class="card-wrapper">
        <div class="card-wrapper" @click="showModal">
            <b-card :title="this.MovieTitle"
                    :img-src="this.PosterIMG"
                    img-alt="Image"
                    img-top
                    tag="article"
                    style="max-width: 14rem;"
                    class="mb-2">
                <p class="card-text">
                    A Movie!
                </p>
            </b-card>
        </div>
        <b-modal ref="modalRef" hide-footer title="Film Information">
            <div class="d-block text-center">
            <h3>Hello From My Modal!</h3>
            </div>
            <b-btn class="mt-3" variant="outline-danger" block @click="hideModal">Close Me</b-btn>
        </b-modal>
    </div>
</template>

<script>
export default {
    props: [
        'MovieTitle',
        'ReleaseDate',
        'PlayTime',
        'Genre',
        'Director',
        'Actors',
        'Description',
        'PosterIMG'
    ],
    methods: {
        showModal () {
            this.$refs.modalRef.show()
        },
        hideModal () {
            this.$refs.modalRef.hide()
        }
    }
}
</script>

<style scoped>

.card-wrapper {
    display: inline-block;
    padding: 0rem;
    margin: 0rem;
}

</style>