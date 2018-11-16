<template>
    <div>
        <b-card @click="showModal"
                :title="this.MovieTitle"
                :img-src="this.PosterIMG"
                img-alt="Image"
                img-top
                style="max-width: 14rem;"
                class="mx-1 my-1">
            <p class="card-text">
                A Movie!
            </p>
        </b-card>
        <b-modal lazy ref="modalRef" hide-footer title="Film Information">
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
