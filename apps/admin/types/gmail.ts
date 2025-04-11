/**
 * Gmail APIの認証情報の型定義
 */
export interface GmailCredentials {
	client_id: string;
	client_secret: string;
	redirect_uri: string;
	token_uri: string;
	auth_uri: string;
}

/**
 * アクセストークン情報の型定義
 */
export interface GmailToken {
	access_token: string;
	refresh_token: string;
	scope: string;
	token_type: string;
	expiry_date: number;
}

/**
 * Gmail APIのエラーレスポンスの型定義
 */
export interface GmailApiError {
	error: {
		code: number;
		message: string;
		status: string;
		details?: Array<{
			type: string;
			reason: string;
			domain: string;
			message: string;
		}>;
	};
}

/**
 * メール送信オプションの型定義
 */
export interface SendMailOptions {
	to: string[];
	cc?: string[];
	bcc?: string[];
	subject: string;
	text?: string;
	html?: string;
	attachments?: Array<{
		filename: string;
		content: Buffer;
		contentType?: string;
	}>;
}

/**
 * メール取得オプションの型定義
 */
export interface GetMailOptions {
	maxResults?: number;
	pageToken?: string;
	labelIds?: string[];
	q?: string;
}

/**
 * メッセージパートの本文の型定義
 */
export interface MessagePartBody {
	attachmentId?: string;
	size: number;
	data?: string;
}

/**
 * メッセージパートの型定義
 */
export interface MessagePart {
	partId: string;
	mimeType: string;
	filename: string;
	headers: Array<{
		name: string;
		value: string;
	}>;
	body: MessagePartBody;
	parts?: MessagePart[];
}

/**
 * メール情報の型定義
 */
export interface GmailMessage {
	id: string;
	threadId: string;
	labelIds: string[];
	snippet: string;
	historyId: string;
	internalDate: string;
	payload: {
		partId: string;
		mimeType: string;
		filename: string;
		headers: Array<{
			name: string;
			value: string;
		}>;
		body: {
			size: number;
			data?: string;
			attachmentId?: string;
		};
		parts?: Array<{
			partId: string;
			mimeType: string;
			filename: string;
			headers: Array<{
				name: string;
				value: string;
			}>;
			body: {
				size: number;
				data?: string;
				attachmentId?: string;
			};
		}>;
	};
	sizeEstimate: number;
}

/**
 * メールリストのレスポンス型定義
 */
export interface GmailMessageList {
	messages: GmailMessage[];
	nextPageToken?: string;
	resultSizeEstimate: number;
}

/**
 * メール修正オプションの型定義
 */
export interface ModifyMessageOptions {
	addLabelIds?: string[];
	removeLabelIds?: string[];
}

/**
 * メール添付ファイルの型定義
 */
export interface EmailAttachment {
	id?: string;
	email_id: string;
	file_name: string;
	file_type: string;
	file_size: number;
	file_path: string;
	attachment_id?: string;
	created_at?: string;
}

/**
 * メール添付ファイルのupsert用の型定義
 */
export interface EmailAttachmentUpsert extends Omit<EmailAttachment, "id"> {
	id?: string;
	is_downloaded?: boolean;
}

export interface GmailSyncResult {
	success: boolean;
	nextPageToken?: string;
	errors?: GmailSyncError[];
}

export interface GmailSyncError {
	type: "attachment" | "email";
	message: string;
	details?: {
		fileName?: string;
		emailSubject?: string;
		errorMessage?: string;
	};
}
