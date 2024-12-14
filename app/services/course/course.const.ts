export const courseUrlEnum = Object.freeze({
    CREATE_COURSE_DETAIL: "/courses",
    GET_COURSE_DETAIL: "/courses",
    UPDATE_COURSE_DETAIL: "/courses/{courseId}",
    DELETE_COURSE_DETAIL: "/courses/{courseId}",

    // course attachment
    CREATE_COURSE_ATTACHMENT_DETAIL: "/courses/{courseId}/attachments",
    DELETE_COURSE_ATTACHMENT_DETAIL: "/courses/{courseId}/attachments/{attachmentId}",

    // course chapters
    GET_COURSE_CHAPTER_DETAIL: "/courses/{courseId}/chapters/{chapterId}",
    CREATE_COURSE_CHAPTER_DETAIL: "/courses/{courseId}/chapters",
    UPDATE_COURSE_CHAPTER_DETAIL: "/courses/{courseId}/chapters/{chapterId}",
    UPDATE_COURSE_CHAPTER_ORDER: "/courses/{courseId}/chapters/reorder",
    DELETE_COURSE_CHAPTER_DETAIL: "/courses/{courseId}/chapters/{chapterId}",

    // course progress
    UPDATE_COURSE_CHAPTER_PROGRESS: "/courses/{courseId}/chapters/{chapterId}/progress",

    // checkout course
    CREATE_COURSE_CHECKOUT_DETAIL: "/courses/{courseId}/checkout"
})