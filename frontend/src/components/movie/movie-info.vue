<template>
    <div>
        <b-card class="mx-1 my-1" style="max-width: 14rem;"
                img-top 
                img-alt="Image"
                :img-src="this.PosterIMG"
                :title="this.MovieTitle"
                @click="showModal">
            <p class="card-text">
                A Movie!
            </p>
        </b-card>
        <b-modal ref="modalRef" 
                 lazy hide-footer
                 title="Film Information">
            <div class="d-block text-center">
            <h3>Hello From My Modal!</h3>
            </div>
            <b-btn class="mt-3" 
                   block variant="outline-danger"
                   @click="hideModal">Close</b-btn>
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
        },
        addComment() {

        },
        deleteComment() {

        },
        bringComments() {

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
