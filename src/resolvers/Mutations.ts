import { Post } from "@prisma/client";
import { Context } from "../index";

interface PostCreateArgs {
	post: {
		title?: string,
		content?: string
	}
}

interface PostPayloadType {
	userErrors: { message: string }[],
	post: Post | null

}
export const Mutation = {
	postCreate: async (parent: any, { post: { title, content } }: PostCreateArgs, { prisma }: Context): Promise<PostPayloadType> => {
		if (!title || !content) {
			return {
				userErrors: [{ message: "You should provide a title and content" }],
				post: null
			}
		}

		return {
			userErrors: [],
			post: await prisma.post.create({
				data: {
					title,
					content,
					authorId: 1
				}
			})
		}
	},

	postUpdate: async (_: any, { postId, post: { title, content } }: { post: PostCreateArgs["post"], postId: String }, { prisma }: Context): Promise<PostPayloadType> => {

		if (!title && !content) {
			return {
				userErrors: [{ message: "Need to have atleaset one field to update" }],
				post: null
			}
		}
		const existingPost = await prisma.post.findUnique({
			where: {
				id: Number(postId)
			}
		})

		if (!existingPost)
			return {
				userErrors: [{ message: "Post does not exists" }],
				post: null
			}

		let payloadToUpdate = {
			title,
			content
		}

		if (!title) delete payloadToUpdate.title;
		if (!content) delete payloadToUpdate.content;

		return {
			userErrors: [],
			post: await prisma.post.update({
				data: payloadToUpdate,
				where: {
					id: Number(postId)
				}

			})
		}
	},

	postDelete: async (_: any, { postId }: { postId: string }, { prisma }: Context): Promise<PostPayloadType> => {

		const existingPost = await prisma.post.findUnique({
			where: {
				id: Number(postId)
			}
		})

		if (!existingPost)
			return {
				userErrors: [{ message: "Post does not exists" }],
				post: null
			}

		await prisma.post.delete({
			where: {
				id: Number(postId)
			}
		})

		return {
			userErrors: [],
			post: null
		}
	}
}