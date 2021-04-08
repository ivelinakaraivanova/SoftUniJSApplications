import { html } from '../../node_modules/lit-html/lit-html.js';
import { getItemById, editRecord } from '../api/data.js';

const editTemplate = (item, onSubmit, errorMsg, invalidMakeModel, invalidYear, invalidDescription, invalidPrice, invalidImage) => html`
<div class="row space-top">
    <div class="col-md-12">
        <h1>Edit Furniture</h1>
        <p>Please fill all fields.</p>
    </div>
</div>
<form @submit=${onSubmit}>
    <div class="row space-top">
        <div class="col-md-4">
            ${errorMsg ? html`<div class="form-group">
                <p>${errorMsg}</p>
            </div>` : ''}
            <div class="form-group">
                <label class="form-control-label" for="new-make">Make</label>
                <input class=${'form-control' + (invalidMakeModel ? ' is-invalid' : ' is-valid')} id="new-make"
                    type="text" name="make" .value=${item.make}>
            </div>
            <div class="form-group has-success">
                <label class="form-control-label" for="new-model">Model</label>
                <input class=${'form-control' + (invalidMakeModel ? ' is-invalid' : ' is-valid')} id="new-model"
                    type="text" name="model" .value=${item.model}>
            </div>
            <div class="form-group has-danger">
                <label class="form-control-label" for="new-year">Year</label>
                <input class=${'form-control' + (invalidYear ? ' is-invalid' : ' is-valid')} id="new-year"
                    type="number" name="year" .value=${item.year}>
            </div>
            <div class="form-group">
                <label class="form-control-label" for="new-description">Description</label>
                <input class=${'form-control' + (invalidDescription ? ' is-invalid' : ' is-valid')}
                    id="new-description" type="text" name="description" .value=${item.description}>
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label class="form-control-label" for="new-price">Price</label>
                <input class=${'form-control' + (invalidPrice ? ' is-invalid' : ' is-valid')} id="new-price"
                    type="number" name="price" .value=${item.price}>
            </div>
            <div class="form-group">
                <label class="form-control-label" for="new-image">Image</label>
                <input class=${'form-control' + (invalidImage ? ' is-invalid' : ' is-valid')} id="new-image"
                    type="text" name="img" .value=${item.img}>
            </div>
            <div class="form-group">
                <label class="form-control-label" for="new-material">Material (optional)</label>
                <input class="form-control" id="new-material" type="text" name="material" .value=${item.material}>
            </div>
            <input type="submit" class="btn btn-info" value="Edit" />
        </div>
    </div>
</form>`;

export async function editPage(ctx) {
    const id = ctx.params.id;
    const item = await getItemById(id);
    ctx.render(editTemplate(item, onSubmit));

    async function onSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = ([...formData.entries()].reduce((a, [k, v]) => Object.assign(a, { [k]: v }), {}));

        // if (Object.entries(data).filter(([k, v]) => k != 'material').some(([k, v]) => v == '')) {
        //     return alert('Please fill all mandatory fields!');
        // }

        if (data.make.length < 4 || data.model.length < 4) {
            return ctx.render(editTemplate(item, onSubmit, 'Make and Model must be at least 4 characters long!', true, false, false, false, false))
        }

        if (data.year < 1950 || data.year > 2050) {
            return ctx.render(editTemplate(item, onSubmit, 'Year must be between 1950 and 2050!', false, true, false, false, false))
        }

        if (data.description.length <= 10) {
            return ctx.render(editTemplate(item, onSubmit, 'Description must be more than 10 characters long!', false, false, true, false, false))
        }

        if (data.price < 1) {
            return ctx.render(editTemplate(item, onSubmit, 'Price must be a positive number!', false, false, false, true, false))
        }

        if (data.img == '') {
            return ctx.render(editTemplate(item, onSubmit, 'Image is a mandatory field!', false, false, false, false, true))
        }

        data.year = Number(data.year);
        data.price = Number(data.price);
        await editRecord(item._id, data);

        ctx.page.redirect('/');
    }
}
