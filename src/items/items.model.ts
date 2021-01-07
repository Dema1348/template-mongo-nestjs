import { modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: {
      getters: true,
      virtuals: true,
    },
  },
})
export class Item {
  @prop({ required: true, minlength: 6, maxlength: 255 })
  name: string;

  @prop({ required: true })
  stock: number;

  @prop({ type: () => [String], required: false })
  tags?: string[];
}
