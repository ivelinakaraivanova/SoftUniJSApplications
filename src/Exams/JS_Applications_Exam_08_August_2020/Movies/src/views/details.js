import { html } from '../../node_modules/lit-html/lit-html.js';
import { getMovieById, deleteMovie, getLikesByMovieId, getOwnLikeByMovieId, addLike } from '../api/data.js';


const detailsTemplate = (movie, isOwner, onDelete, likes, likeMovie, isLiked) => html`
<section id="movie-details">
    <div class="container">
        <div class="row bg-light text-dark">
            <h1>Movie title: ${movie.title}</h1>

            <div class="col-md-8">
                <img class="img-thumbnail" src=${movie.img}
                    alt="Movie">
            </div>
            <div class="col-md-4 text-center">
                <h3 class="my-3 ">Movie Description</h3>
                <p>${movie.description}</p>
                ${isOwner 
                    ? html`
                        <a @click=${onDelete} class="btn btn-danger" href="javascript:void(0)">Delete</a>
                        <a class="btn btn-warning" href="/edit/${movie._id}">Edit</a>` 
                    :
                    (!isLiked 
                        ?
                        html`
                        <a @click=${likeMovie} class="btn btn-primary" href="javascript:void(0)">Like</a>` 
                        :
                        html`
                        <span class="enrolled-span">Liked ${likes}</span>`
                    )
                }
            </div>
        </div>
    </div>
</section>`;

export async function detailsPage(ctx) {
    const movieId = ctx.params.id;
    const movie = await getMovieById(movieId);
    const isOwner = ctx.user && movie._ownerId == ctx.user._id;
    let likes = await getLikesByMovieId(movieId);
    let isLiked = (await getOwnLikeByMovieId(movieId, ctx.user._id)).length > 0;
    
    ctx.render(detailsTemplate(movie, isOwner, onDelete, likes, likeMovie, isLiked));

    async function onDelete() {
        const confirmed = confirm('Are you sure you want to delete this movie?');
        if (confirmed) {
            await deleteMovie(movieId);
            ctx.page.redirect('/');
        }
    }

    async function likeMovie() {
        await addLike({movieId: movieId, _ownerId: ctx.user._id});
        ctx.page.redirect(ctx.path);
    }
}