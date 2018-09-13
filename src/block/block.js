/**
 * BLOCK: algori-pdf-viewer
 *
 * Algori PDF Viewer is a Gutenberg Block Plugin that enables you to easily display PDF documents directly on your website.
 */
 
 
/**
 * WordPress dependencies
 */
const {
	withSelect
} = wp.data; // import { withSelect } from '@wordpress/data'
const { 
	IconButton, 
	PanelBody,
	TextControl,  
	SelectControl,
	ToggleControl,
	Toolbar, 
	withNotices } = wp.components; // import { IconButton, PanelBody, RangeControl, ToggleControl, Toolbar, withNotices } from '@wordpress/components';
const { Fragment } = wp.element; // import { Fragment } from '@wordpress/element';
const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { 
	BlockControls,
	InspectorControls,
	ContrastChecker,
	PanelColorSettings,
	BlockAlignmentToolbar,
	MediaPlaceholder,
	MediaUpload,
	AlignmentToolbar,
	RichText, 
	BlockIcon,
} = wp.editor; // Import * from @wordpress/editor 


/**
 * Internal dependencies
 *
 * Import CSS.
 */
import './style.scss';
import './editor.scss';

const blockAttributes = {
	title: {
		type: 'array',
		source: 'children',
		selector: 'p',
	},
	url: {
		type: 'string',
	},
	align: {
		type: 'string',
	},
	width: {
		type: 'number',
	},
	height: {
		type: 'number',
	},
	contentAlign: {
		type: 'string',
		default: 'center',
	},
	id: {
		type: 'number',
	},
};



/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'cgb/block-algori-pdf-viewer', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	
	title: __( 'PDF Viewer' ), // Block title.
	
	description: __( 'Let visitors view your PDF documents directly on your site! Insert a PDF file.' ),  // Block description that appears in the block inspector. Make it short preferably.
	
	icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/></svg>, // Block icon from Material Design Icons → https://material.io/tools/icons/
	
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	
	keywords: [ // Block search keywords
		__( 'portable document format' ), 
		__( 'file' ), 
		__( 'algori' ), 
	],
	
	attributes: blockAttributes,  // Block attributes for editing in the block inspector.
	
	getEditWrapperProps( attributes ) {
		const { align, width } = attributes;
		if ( 'left' === align || 'center' === align || 'right' === align || 'wide' === align || 'full' === align ) {
			return { 'data-align': align, 'data-resized': !! width };
		}
	},
	

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: withNotices( ( { attributes, setAttributes, isSelected, className, noticeOperations, noticeUI } ) => {
		
		const { url, title, align, width, height, contentAlign, id } = attributes;
		
		const updateWidth = ( width ) => setAttributes( { width: parseInt( width, 10 ) } );
		const updateHeight = ( height ) => setAttributes( { height: parseInt( height, 10 ) } );
		const updateAlignment = ( nextAlign ) => setAttributes( { align: nextAlign } );
											 
		
		const onSelectPDF = ( media ) => {
			if ( ! media || ! media.url ) {
				setAttributes( { url: undefined, id: undefined } );
				return;
			}
			setAttributes( { url: media.url, id: media.id } );
		};
		
		const controls = ( // Set Block and Inspector Controls
			<Fragment>
				<BlockControls>
					<BlockAlignmentToolbar
						value={ align }
						onChange={ updateAlignment }
					/>
					<Toolbar>
						<MediaUpload
							onSelect={ onSelectPDF }
							type="*"
							value={ id }
							render={ ( { open } ) => (
								<IconButton
									className="components-toolbar__control"
									label={ __( 'Change PDF' ) }
									icon="edit"
									onClick={ open }
								/>
							) }
						/>
					</Toolbar>
				</BlockControls>
				{ !! url && (
					<InspectorControls>
						<PanelBody title={ __( 'PDF Dimensions' ) } initialOpen={ false }> 
							<div>
								<TextControl
									type="number"
									label={ __( 'Width' ) }
									value={ width !== undefined ? width : '' }
									placeholder={ 600 }
									min={ 1 }
									onChange={ updateWidth }
								/>
								<TextControl
									type="number"
									label={ __( 'Height' ) }
									value={ height !== undefined ? height : '' }
									placeholder={ 300 }
									min={ 1 }
									onChange={ updateHeight }
								/>
							</div>
						</PanelBody>
					</InspectorControls>
				) }
			</Fragment>
		);
		
		if ( ! url ) { // Upload PDF if it doesn't exist
			
			return ( 
				<Fragment>
					{ controls }
					<MediaPlaceholder
						icon={ <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/></svg> }
						className={ className }
						labels={ {
							title: __( 'PDF Viewer' ),
							name: __( 'a PDF document' ),
						} }
						onSelect={ onSelectPDF }
						accept="application/pdf"
						type="*"
						notices={ noticeUI }
						onError={ noticeOperations.createErrorNotice }
					/>
				</Fragment>
			);
			
		}
		
		return ( // Return PDF viewer with element settings (css classes) and block controls. Get PDF using either { url } or { id }
			<Fragment>
				{ controls }
				<div className="wp-block-cgb-block-algori-pdf-viewer">
					<iframe 
						className="wp-block-cgb-block-algori-pdf-viewer-iframe"
						src={ algoriPDFViewerPluginDirectoryPath + "/algori-pdf-viewer-lite/dist/web/viewer.html?file=" + encodeURIComponent(url) }
						style={ { width, height } }
					>
					</iframe>
				</div>
			</Fragment>
		);
		
	} ),

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save: ( { attributes, className } ) => {
		
		const { url, title, align, width, height, contentAlign, id } = attributes;
		
		return (
			<div className="wp-block-cgb-block-algori-pdf-viewer">
				<iframe 
					className="wp-block-cgb-block-algori-pdf-viewer-iframe"
					src={ algoriPDFViewerPluginDirectoryPath + "/algori-pdf-viewer-lite/dist/web/viewer.html?file=" + encodeURIComponent(url) }
					style={ { width, height } }
				>
				</iframe>
			</div>
		);
		
	},
} );
