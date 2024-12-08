import format from "string-format";

import { lmsApiInstance } from "@/app/api/lms.api";
import { courseUrlEnum } from "./course.const";

class CourseService {
    static courseService = new CourseService()

    createCourseDetail = async ({ body }: { body: any }) => {
        const response = await lmsApiInstance().post(
            courseUrlEnum.CREATE_COURSE_DETAIL,
            body
        )

        return response;
    }

    getCourseDetail = async ({ params }: { params: { courseId: string } }) => {
        const response = await lmsApiInstance().get(
            courseUrlEnum.GET_COURSE_DETAIL,
            { params: { courseId: params?.courseId } }
        )

        return response;
    }

    updateCourseDetail = async ({ params, body }: { params: { courseId: string | string[] }, body: any }) => {
        const response = await lmsApiInstance().patch(
            format(courseUrlEnum.UPDATE_COURSE_DETAIL, params),
            body
        )

        return response;
    }

    // create course attachments
    createCourseAttachmentsDetail = async ({ params, body }: { params: { courseId: string | string[] }, body: any }) => {
        const response = await lmsApiInstance().post(
            format(courseUrlEnum.CREATE_COURSE_ATTACHMENT_DETAIL, params),
            body
        )

        return response;
    }

    // delete attachment
    deleteCourseAttachmentDetail = async ({ params }: { params: { attachmentId: string } }) => {
        const response = await lmsApiInstance().delete(
            format(courseUrlEnum.DELETE_COURSE_ATTACHMENT_DETAIL, params)
        )

        return response;
    }
}

export default CourseService.courseService