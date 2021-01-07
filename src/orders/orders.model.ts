import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Item } from 'src/items/items.model';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: {
      getters: true,
      virtuals: true,
    },
  },
})
export class Order {
  @prop({ required: true, minlength: 6, maxlength: 255 })
  code: string;

  @prop({
    ref: () => Item,
  })
  items?: Ref<Item>[];
}
